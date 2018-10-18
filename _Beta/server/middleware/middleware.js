let middleware = {
    get_entry: function (_db, _entry_model, _req_entry, _page) {
        "use strict";
        return function (req, res, next) {
            let found_entry = _entry_model.find_by_id(_db, _req_entry);

            found_entry.then(function (found_entry) {
                res.render(_page, {dbColEntries: found_entry});
            });
        };
    }
};

module.exports = middleware;