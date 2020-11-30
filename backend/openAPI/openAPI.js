var express = require('express')
var router = express.Router()
const controllers = require('./controllers')
const status = require('../utilities/statusFunctions')

router.get('/subject', status.check_login ,controllers.getSubjects);

router.get('/subject/:scode/course', controllers.getCourses);

router.get('/subject/:scode/course/:ccode/timetable/:compcode?', controllers.getTimetables);

router.post('/schedule/:schcode/', controllers.createSchedule);

router.put('/schedule/:schcode/scheduledata', controllers.updateSchedule);

router.get('/schedule/:schcode/scheduledata', controllers.getScheduleData);

router.delete('/schedule/:schcode', controllers.deleteSchedule);

router.delete('/schedule', controllers.deleteAllSchedule);

router.get('/schedule', status.check_admin, controllers.getAllSchedule);

module.exports = router