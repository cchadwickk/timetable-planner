var express = require('express')
var router = express.Router()
const controllers = require('./controllers')
var { check_login } = require('../utilities/utilities')

router.use(check_login);

router.put('/courseList', controllers.createCourseList);

router.delete('/courseList', controllers.deleteCourseList);

router.get('/courseList', controllers.getCourseLists);

router.get('/courseListTimetables', controllers.privateCourseTimetable);

router.put('/courseReview', controllers.addReview);

module.exports = router