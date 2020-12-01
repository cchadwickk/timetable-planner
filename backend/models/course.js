var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

var TimeTableData = new Schema({
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

var ReviewData = new Schema({
    content: {type: String},
    visibility: {type: Boolean, default: true},
    email: {type: String},
    reviewerName: {tpye: String},
    reviewDate: {type: Date, default: Date.now}
})

var Course = new Schema({
    catalog_nbr : {type: String},
	subject : {type: String},
	className : {type: String},
    course_info: [TimeTableData],
    catalog_description: {type: String},
    reviews: [ReviewData]
})

Course.plugin(mongoose_fuzzy_searching, { fields: ['catalog_nbr', 'className'] })

module.exports = mongoose.model('Course', Course);