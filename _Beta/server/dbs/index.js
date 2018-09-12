const MongoClient = require('mongodb').MongoClient;
let state = {
  db: null,
};

exports._connect = function(url, done) {

  if(state.db) return done();

  MongoClient.connect(url, {user: 'aptoptout', password:'worldwiderepository-Macbook2014'}, function(err, client) {
    
    if(err) return done(err);
    state.db = client.db('world-wide-repository');

    done();

  });

};

exports._get = function() {
  return state.db;
};