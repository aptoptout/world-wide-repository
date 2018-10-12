const path = require('path');
const express = require('express');
const WWR_db_URI = require('./hidden/myCreds.js');
const app = express();
const port = 3000;

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
db.connect(WWR_db_URI, function (err) {
    "use strict";
    if (err) {
        console.log('Unable to connect with WWR database.', err);
        process.exit(1);
    } else {
        app.listen(port, function () {
            console.log(`Listening on port ${port}`);
        });
    }
});