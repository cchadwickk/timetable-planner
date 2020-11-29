var express = require('express')
var router = express.Router()
const controllers = require('./controllers')

router.get('/subject',controllers.getSubjects);

router.get('/subject/:scode/course', controllers.getCourses);

router.get('/subject/:scode/course/:ccode/timetable/:compcode?', controllers.getTimetables);

router.post('/schedule/:schcode/', controllers.createSchedule);

router.put('/schedule/:schcode/scheduledata', controllers.updateSchedule);

router.get('/schedule/:schcode/scheduledata', controllers.getScheduleData);

router.delete('/schedule/:schcode', controllers.deleteSchedule);

router.delete('/schedule', controllers.deleteAllSchedule);

router.get('/schedule', controllers.getAllSchedule);

module.exports = router