const express = require('express');
const router = express.Router();
const db = require('../dbs');
const middleware = require('../middleware/middleware.js');
const entry_model = require('../models/entry.js');

// Home page route
router.get('/', middleware.get_entry(db, entry_model, '0', 'index'));
// router.get('/', function (req, res) {
//   res.send('GET request to the homepage')
// });

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

