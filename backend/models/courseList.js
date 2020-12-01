var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListData = new Schema({
    year: {type: Number},
    course: {type: String},
    subject: {type: String}
}, {_id: false});

var CourseList = new Schema({
    creatorEmail: {type: String},
    creatorName: {type: String},
    courseListName: {type: String, unique: true},
    private: {type: Boolean, default: true},
    lastUpdated: {type: Date, default: Date.now},
    listData: [ListData]
});

module.exports = mongoose.model('CourseList', CourseList);