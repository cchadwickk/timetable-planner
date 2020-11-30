var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String,
    email_is_verified: {type: Boolean, default: false},
    external: {type: String, default: ''},
    active: {type: Boolean, default: true},
    course_list_count: {type: Number, default: 0},
    admin: {type: Boolean, default: 0}
});

Account.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model('Account', Account);