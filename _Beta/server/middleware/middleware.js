// const entry_model = require('../models/entry.js');

let middleware = {
    get_entry: function (_db, _entry_model, _req_entry, _page) {
        "use strict";
        console.log('Hello');
        return function (err, req, res, next) {
            if (err) {
                console.log(err);
                res.error(err);
            } else {
                const render_this = entry_model.find_by_id(_db, _req_entry, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                res.render('_page', {dbColEntries: render_this});
            }
        };
    }
};

module.exports = middleware;

// let dbColEntries = db._get().collection('entries');