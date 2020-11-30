var express = require('express')
var mongoose = require('mongoose')
var passport = require('passport')
require("dotenv").config()
var openAPI = require('./openAPI/openAPI')
var authAPI = require('./authAPI/authAPI')
var Account = require('./models/account')
var bodyParser = require('body-parser');
var expressSession = require('express-session')({
  secret: process.env.COOKIE_STRING,
  resave: false,
  saveUninitialized: false
});
var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING);

app.use( (req, res, next) => {
    console.log(Date().toLocaleString()+' '+req.method+' '+decodeURIComponent(req.url) )        //To log hits, with time
    next();
});
app.use('/api/open', openAPI)
app.use('/api/auth', authAPI)

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on ${port}...`))