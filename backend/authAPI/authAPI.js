var router = require('express').Router()
const controllers = require('./controllers')
var passport = require('passport')
var status = require('../utilities/utilities')

router.post('/login', passport.authenticate('local'), controllers.login);

router.get('/logout', controllers.logout);

router.post('/register', controllers.register);

router.post('/changePassword', status.check_login, controllers.changePassword);

router.get('/verifyEmail/:verifystring', controllers.verifyEmail);

router.get('/resendEmail', controllers.resendEmail);

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        //res.redirect('/');
        res.send({"message":"Google login/registration successful"})
    });

module.exports = router