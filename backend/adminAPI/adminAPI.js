var express = require('express')
var router = express.Router()
const controllers = require('./controllers')
var { check_admin } = require('../utilities/utilities')

router.use(check_admin);

router.get('/users', controllers.getUsers);

router.put('/user', controllers.updateUser);

router.get('/reviews', controllers.getReviews)

router.put('/review', controllers.updateReview)

module.exports = router