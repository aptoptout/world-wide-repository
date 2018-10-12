const MongoClient = require('mongodb').MongoClient;
let state = {
    db: null
};

exports.connect = function (url, done) {
    "use strict";
    if (state.db) {
        return done();
    }

    MongoClient.connect(url, function (err, client) {

        if (err) {
            return done(err);
        }

        state.db = client.db("worldwiderepository");

        done();

    });

};

exports.get = function () {
    "use strict";
    return state.db;
};