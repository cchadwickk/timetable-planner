var express = require('express')
var mongoose = require('mongoose')
var passport = require('passport')
var bodyParser = require('body-parser');
require("dotenv").config()
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var { strategyOptions, verifyCallback } = require('./authAPI/google');
var expressSession = require('express-session')({ secret: process.env.COOKIE_STRING, resave: false, saveUninitialized: false });
var openAPI = require('./openAPI/openAPI')
var secureAPI = require('./secureAPI/secureAPI')
var adminAPI = require('./adminAPI/adminAPI')
var authAPI = require('./authAPI/authAPI')
var Account = require('./models/account')
var { customLogger } = require('./utilities/utilities')
var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(Account.createStrategy());
passport.use(new GoogleStrategy(strategyOptions, verifyCallback))
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true } ).then(result => {
  var conn = result.connections[0];
  if(conn._readyState)
    console.log("\n############# Mongoose successfully connected to "+conn.host+":"+conn.port+"/"+conn.name+" #########\n\n\n\n");
});

app.use( customLogger );
app.use('/api/open', openAPI)
app.use('/api/auth', authAPI)
app.use('/api/secure', secureAPI)
app.use('/api/admin', adminAPI)

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`\n########### Listening on port ${port} ############\n`))