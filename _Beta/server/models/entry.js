const schema = require('./schemas.js');

let _entry = function (data) {
    "use strict";
    this.data = data;
};

_entry.prototype.data = {};

_entry.find_by_id = function (_db, _id) {
    "use strict";
    return _db.get().collection('entries').findOne({local_id: _id})
};

module.exports = _entry;




// let _entry.prototype.save = function (callback) {
//     const _self = this.

//     req.db.get('usercollection').insert({});
// }


// entry.publish_to_db
// entry.remove_entry

// entry.change_title
// entry.change_chapter
// entry.remove_chapter