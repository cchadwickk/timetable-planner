var router = require('express').Router()
const controllers = require('./controllers')
var passport = require('passport')

router.post('/login', passport.authenticate('local'), controllers.login);

router.get('/logout', controllers.logout);

router.post('/register', controllers.register);

module.exports = router