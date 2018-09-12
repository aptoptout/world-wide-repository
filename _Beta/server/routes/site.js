const express = require('express');
const router = express.Router();
const db = require('../dbs');

// Home page route
router.get('/', function(req, res) {

  let dbColEntries = db._get().collection('entries');

  dbColEntries.find({}).toArray(function(err, docs){

      if(err) {

        console.log(err);
        res.error(err);

      } else {

        res.render('index', { dbColEntries: docs });

      }
  });
});

module.exports = router;