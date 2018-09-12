// exports._dbRoute = function(app, dbs) {

//   app.get('/', function(req, res) {

//     dbs.database.collection('entries').find({}).toArray(function(err, docs){

//       if(err) {

//         console.log(err);
//         res.error(err);

//       } else {

//         res.json(docs);

//       }

//     });

//   });

//   return app;
  
// };