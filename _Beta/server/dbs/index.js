const MongoClient = require('mongodb').MongoClient;
let state = {
  db: null,
};

exports._connect = function(url, done) {

  if(state.db) return done();
  
  MongoClient.connect(url, function(err, client) {
    
    if(err) return done(err);
    state.db = client.db("worldwiderepository");

    done();

  });

};

exports._get = function() {
  return state.db;
};