const express = require('express');
const router = express.Router();
const db = require('../dbs');
const middleware = require('../middleware/middleware.js');
const entry_model = require('../models/entry.js');

// Home page route
router.get('/', middleware.get_entry(db, entry_model, '5b9b49a61c9d44000021c41c', 'index'));

module.exports = router;




// OLD ROUTE MIDDLEWARE ENTRY HANDLER
// router.get('/', function(req, res) {

//   let dbColEntries = db._get().collection('entries');

//   dbColEntries.find({}).toArray(function(err, docs){

//       if(err) {

//         console.log(err);
//         res.error(err);

//       } else {
//         res.render('index', { dbColEntries: docs });
//         console.log(docs);

//       }
//   });
// });

