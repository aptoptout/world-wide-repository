var express = require('express');
var router = express.Router();
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    cheerio = require('cheerio'),
    request = require('request'),
    bodyParser = require('body-parser'),
    jade = require('jade');

console.log(path.dirname(require.main.filename));
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(bodyParser.json());

// Custom middleware for every request we make
var middleware = {
  render: function (view) {
    return function (req, res, next) {
      res.render(view);
    }
  }, 
  getUserCollection: function(hello){
    return function (req, res, next) {
      db = req.db;
      collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
        collection.find({present:"kabk"},{},function(err, current_doc){
          res.render(hello, {
            "currentlive" : current_doc,
            "entrylist" : docs
          });
        });
      });
    }
  },

  getUserColCurEnt: function(hello){
    return function (req, res, next) {
      
      var currEntry = req.CurEntVar;
      
      db = req.db;
      collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
        res.render(hello, {
          "entrylist" : docs,
          "currEntry" : currEntry
        });
      });
    }
  },

  initEntry: function(req, res, next) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var creatorname = req.body.creatorname;
    var rawDate = new Date();
    var initdate = rawDate.toDateString();
    var _present = req.body.presenthere;

    // Set our collection
    var collection = db.get('usercollection');

    var weHaveSize = function(_size){
        var uniqIDNum = _size + 1;
        var uniqID = "N"+uniqIDNum;        
        // console.log(uniqID);
        collection.insert({
            "localID" : uniqID,
            "present" : _present,
            "creatorname" : creatorname,
            "initdate" : initdate,
            "chapters" : []
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            } else {
              req.CurEntVar = doc;
              return next();
            }
        });
    }

    var getSize = function(callback){
      collection.find({}, function(err,data){
        if(err)
          return callback(0);

        return callback(data.length);
      });
    }

    getSize(weHaveSize);
  },

  addChapters: function(req, res, next){
    // Set our internal DB variable
    var db = req.db;
    
    // Set our collection
    var collection = db.get('usercollection');
    
    // localID value of the entry that should be updated
    var findThis = req.body.thisEntry;

    // Assign POST data to variables
    var _introduction = req.body.introduction;
    var amountChap = req.body.indexVal;
    var tags = req.body.tags;
    var tagsArr = tags.split(",");
    var _entryname = req.body.entryname;
    // some more variables
    var newchapters = [];
    var updateDATE = new Date();

    // some empty 'fake' array variables so that [i] & [_num] can be called on them
    var scrapedData = [];
    var chapter = [];

    var scrapeThisCompleteURL = [];

    var scrapeLoop = function(callback, i) {
      if( i <= amountChap ) {
        scrapeThisCompleteURL[i] = 'http://www.wikipedia.org/wiki/' + req.body['chapURL' + i];
        console.log(scrapeThisCompleteURL[i]);
        request(
          {
            url: scrapeThisCompleteURL[i], //URL to hit
            method: 'GET', //Specify the method
          },
          function(error, response, html) {
            if(!error && response.statusCode == 200) {

              var $ = cheerio.load(html);

              $('table.vertical-navbox.nowraplinks').remove();
              $('script').remove();
              $('link').remove();
              $('.hatnote').remove();
              $('ul').remove();
              $('sup').remove();
              $('.navbox').remove();
              $('#External_links').remove();
              $('.metadata').remove();
              $('.printfooter').remove();
              $('.catlinks').remove();
              $('#footer').remove();
              $('.reflist').remove();
              $('.mw-editsection').remove();
              $('#mw-head').remove();
              $('#mw-navigation').remove();
              $('table').remove();
              $('audio').remove();
              $('video').remove();


              if(req.body['chapLVL' + i] == 1){

                scrapedData[i] = $('p');

              } else if(req.body['chapLVL' + i] == 2){

                scrapedData[i] = $('body');


              } else if(req.body['chapLVL' + i] == 3){
                
                scrapedData[i] = $('img');

              };

              

              console.log(i, "scrape the data");

              if(scrapedData[i].length == 0){
                console.log('Something went wrong! scrapedData var is empty :( ...');
              } else {

                chapter[i] = {
                  "url" : scrapeThisCompleteURL[i],
                  "content" : 'content/' + findThis + '_chapter' + i + '.html',
                  "level" : req.body['chapLVL' + i],
                  "timereq" : updateDATE
                };

                if(chapter[i] == 0){
                  console.log('Chapter not pushed in object');
                } else {
                  newchapters.push(chapter[i]);
                }

                if(newchapters.length <= amountChap ){
                  callback(scrapedData[i], i);
                }

                if(newchapters.length == amountChap){
                  collection.update(
                    { localID: findThis }, 
                    { $set: { entryname: _entryname, introduction: _introduction, chapters: newchapters, tags: tagsArr } }, 
                    { multi: false }, 
                    function(error, count) {
                     if(error) { 
                        console.log(error); 
                      }
                      console.log("updated!");

                      req.story = findThis;

                      console.log(req.story);
                      return next();
                    }
                  );
                }

                scrapeLoop(saveScrape, i+1);
              }
            } else {
              console.log("ERROR! No HTTP 200 statusCode received.")
            }
          }
        );
      }
    }

    var saveScrape = function(_scrapeddata, _num){
      fs.writeFile('content/' + findThis + '_chapter' + _num + '.html', _scrapeddata, 
        function(err)
          {
            console.log(findThis, '_chapter' + _num + '.html successfully written!');
          }
      );
    }

    scrapeLoop(saveScrape, 1);
  },

  renderEntryViewAfterPost: function(hello){
    return function (req, res, next) {
      
      var currEntry = req.story;
      var foundObj;
      
      db = req.db;
      collection = db.get('usercollection');

      collection.findOne({ localID : currEntry }, 
        function(error, _doc){ 
          foundObj = _doc;
          console.log(foundObj, _doc);

          if(foundObj.length == 0){
            return next(new Error('foundObj is empty... :('));
          } else{
            collection.find({},{},function(e,docs){
              res.render(hello, {
                "entrylist" : docs,
                "currEntry" : foundObj
              });
            });
          }
        }
      );
    }
  },

  renderEntryView: function(hello){
    return function (req, res, next) {
      
      var currEntry = req.story;

      db = req.db;
      collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
        res.render(hello, {
          "entrylist" : docs,
          "currEntry" : currEntry
        });
      });
    }
  },

  renderEntryViewChapters: function(hello){
    return function (req, res, next) {
      var AbsoPath = '../';

      var currEntry = req.story;
      var currEntryChapLength = currEntry.chapters.length;
      var currEntryRelPathChap1 = currEntry.chapters[0].content;
      var currEntryRelPathChap2 = currEntry.chapters[1].content;
      var currEntryRelPathChap3 = currEntry.chapters[2].content;
      var currEntryRelPathChap4 = currEntry.chapters[3].content;
      var currEntryRelPathChap5 = currEntry.chapters[4].content;

      var fullChapPath1 = AbsoPath + currEntryRelPathChap1;
      var fullChapPath2 = AbsoPath + currEntryRelPathChap2;
      var fullChapPath3 = AbsoPath + currEntryRelPathChap3;
      var fullChapPath4 = AbsoPath + currEntryRelPathChap4;
      var fullChapPath5 = AbsoPath + currEntryRelPathChap5;

      db = req.db;
      collection = db.get('usercollection');
      collection.find({},{},function(e,docs){
        res.render(fullChapPath1, function(err, _html1){
          res.render(fullChapPath2, function(err, _html2){
            res.render(fullChapPath3, function(err, _html3){
              res.render(fullChapPath4, function(err, _html4){
                res.render(fullChapPath5, function(err, _html5){
                  // console.log(fullChapPath);
                  if(err){ return next(err); }
                  // var compiledHTML = jade.renderFile(_html);
                  res.render(hello, {
                    "entrylist" : docs,
                    "currEntry" : currEntry,
                    "chap1" : _html1,
                    "chap2" : _html2,
                    "chap3" : _html3,
                    "chap4" : _html4,
                    "chap5" : _html5
                  });

                });
              });
            });
          });
        });
      });
    }
  }

};

router.get('/', middleware.getUserCollection('index'));
router.get('/h2p', middleware.getUserCollection('h2p'));
router.get('/initbook', middleware.getUserCollection('initbook'));
router.get('/notdynamic/:entry', middleware.renderEntryView('notdynamicentry'));

// Init book with the proper Object structure
// POST to Add User Service
router.post('/', middleware.initEntry, middleware.getUserColCurEnt('initbook'));

// router.get('/initbook/:entryname',middleware.findEntryView, function(req, res, next){
//   return response.render('user', req.user);});

router.param('entry', function(req, res, next, entry){
  req.db.get('usercollection').findOne({localID: entry}, function (error, story){
    if (error) return next(error);
    if (!story) return next(new Error('Nothing is found'));
    req.story = story;
    next();
  });
});  

router.post('/initbook', middleware.addChapters, middleware.renderEntryViewAfterPost('entrycontentview'));
router.get('/initbook/:entry', middleware.renderEntryViewChapters('entrycontentview'));
router.get('/initbook/entrycontentview/:entry/', middleware.renderEntryViewChapters('entrycontentview')); 

module.exports = router;

///////////////////////////////////////////////
// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.

// router.get('/', function(req, res){
//   // The form's action is '/' and its method is 'POST',
//   // so the `app.post('/', ...` route will receive the
//   // result of our form
//   var html = '<form action="/" method="post">' +
//                'Enter your name:' +
//                '<input type="text" name="userName" placeholder="..." />' +
//                '<br>' +
//                '<button type="submit">Submit</button>' +
//             '</form>';
               
//   res.send(html);
// });
///////////////////////////////////////////////
///////////////////////////////////////////////
// Working with params & routing the entries
// great stuff, great stuff...

// findEntryView: function(req,res,next){

//   var findUserByUsername = function (_entryName, callback) {
//     // Perform database query that calls callback when it's done
//     db = req.db;
//     collection = db.get('usercollection');
//     console.log(_entryname, 'is the name requested');

//     collection.findOne({localID : _entryName},{},function(e,doc){
//       var viewthisEntry = doc
//       return callback(null, viewthisEntry)
//     });
//   };

//   var findUserByUsernameMiddleware = function(req, res, next){
//     if (req.params.entryname) {
//       console.log('Entryname param was detected: ', req.params.entryname)
//       findUserByUsername(req.params.entryname, function(error, user){
//         if (error) return next(error);
//           req.user = user;
//         return next();
//       })
//    } else {
//      return next();
//    }
//   }

//   findUserByUsernameMiddleware();    
// }
///////////////////////////////////////////////
///////////////////////////////////////////////
// Useable wikipedia removes
//
// $('#jump-to-nav').remove();
// $('#toc').remove();
// $('img').remove();
// $('ul').remove();
// $('ol').remove();
// $('table').remove();
// $('.hatnote').remove();
// $('#mw-navigation').remove();
// $('#See_also').remove();
// $('#References').remove();
// $('#footer').remove();
// $('.printfooter').remove();
// $('#External_links').remove();
// $('#catlinks').remove();
// $('script').remove();