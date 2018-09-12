const path = require('path')
const express = require('express');
const app = express();
const port = 3000;
const WWR_db_URI = "mongodb://ds161740.mlab.com:61740/world-wide-repository";


// Routing
// General
const site = require('./server/routes/site.js');
const db = require('./server/dbs');

// Config
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'client/views'));

app.use('/', site);

// Port
// Initialize the application once database connections are ready.
db._connect(WWR_db_URI, function(err) {
  if(err) {
    console.log('Unable to connect with WWR mLab database.');
    process.exit(1);
  } else {
    app.listen(port, function() {
      console.log(`Listening on port ${port}`);
    });
  }
});