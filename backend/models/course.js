var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

var ReviewData = new Schema({
    content: {type: String},
    reviewerEmail: {type: String},
    reviewerName: {type: String},
    visible: {type: Boolean, default: true},
    reviewDate: {type: Date, default: Date.now}
}, {_id: false});

var Course = new Schema({
    catalog_nbr : {type: String},
	subject : {type: String},
	className : {type: String},
    course_info: [TimeTableData],
    catalog_description: {type: String},
    reviews: [ReviewData],

    class_nbr : {type: Number},
    start_time : {type: String},
    descrlong : {type: String},
    end_time : {type: String},
    campus : {type: String},
    facility_ID : {type: String},
    days : [ {type: String} ],
    instructors : [ {type: String} ],
    class_section : {type: String},
    ssr_component : {type: String},
    enrl_stat : {type: String},
    descr : {type: String}
})

Course.plugin(mongoose_fuzzy_searching, { fields: ['catalog_nbr', 'className'] })

module.exports = mongoose.model('Course', Course);