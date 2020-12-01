var express = require('express')
var router = express.Router()
const controllers = require('./controllers')

router.get('/search', controllers.searchMain);

router.get('/searchKeyword', controllers.searchByKeyword);

router.get('/courseLists', controllers.publicCourseLists)

router.get('/courseListTimetables', controllers.publicCourseTimetable)

module.exports = router