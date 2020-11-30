var router = require('express').Router()
const controllers = require('./controllers')
var passport = require('passport')
var status = require('../utilities/statusFunctions')

router.post('/login', passport.authenticate('local'), controllers.login);

router.get('/logout', controllers.logout);

router.post('/register', controllers.register);

router.post('/changePassword', status.check_login, controllers.changePassword);

router.get('/verifyEmail/:verifystring', controllers.verifyEmail);

module.exports = router