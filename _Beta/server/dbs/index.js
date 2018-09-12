const MongoClient = require('mongodb').MongoClient;
let state = {
  db: null,
};

exports._connect = function(url, done) {

  if(state.db) return done();

  MongoClient.connect(url, {user: my_username, password:my_password}, function(err, client) {
    
    if(err) return done(err);
    state.db = client.db(my_database);

    done();

  });

};

exports._get = function() {
  return state.db;
};