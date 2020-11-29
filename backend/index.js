var express = require('express')
var app = express()
var openAPI = require('./openAPI/openAPI')
const port = process.env.PORT || 3000;

app.use( (req, res, next) => {
    console.log(Date().toLocaleString()+' '+req.method+' '+decodeURIComponent(req.url) )                     //To log hits, with time
    next();
});

app.use(express.json())

app.use('/api/open', openAPI)

app.listen(port, ()=> console.log(`Listening on ${port}...`))