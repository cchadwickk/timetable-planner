var Joi = require('joi')
var express = require('express')
var app = express()
var router=express.Router()
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = "mongodb://admin:ece9065@lab2.ece9065.tk:27017/ece9065_lab3?authSource=admin";
var TimetableCollection = "timetable_data"
var ScheduleCollection = "schedule_data"

router.use( (req, res, next) => {
    console.log(Date().toLocaleString()+' '+req.method+' '+decodeURIComponent(req.url) )                     //To log hits, with time
    next();
});

async function mongoFind(collection, query, projection){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).find( query, { projection: projection }).toArray());
    client.close();
    return mongoRes;
}

async function mongoInsertOne(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).insertOne( query));
    client.close();
    return mongoRes;
}

async function mongoUpdateOne(collection, query, actionQuery){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).updateOne( query, actionQuery));
    client.close();
    return mongoRes;
}

async function mongoDeleteOne(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).deleteOne( query));
    client.close();
    return mongoRes;
}

async function mongoDeleteMany(collection, query){
    const client = await MongoClient.connect(MongoUrl)
    .catch(err => { console.log(err); });

    mongoRes = await (client.db().collection(collection).deleteMany( query));
    client.close();
    return mongoRes;
}

function checkSpecialChar(str){
    const regex= RegExp("\\`|\\~|\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\(|\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\\|\\'|\\<|\\,|\\.|\\>|\\?|\\/|\\\"|\\;|\\:|\\s");
    if(regex.test(str))
        return true;
    else
        return false
}

router.get('/subject',(req, res) => {
    mongoFind(TimetableCollection, {}, { subject:1, className:1, _id:0 })
    .then( result => {
        result = result.map(elm => ({ "Subject Code": elm.subject, Description: elm.className}));
        res.send(result)
    });
});

router.get('/subject/:scode/course', (req, res) => {
    const SubjectCode = req.params.scode;

    const Schema = Joi.string().min(1).max(9).alphanum();      //Check that subject code is alnum string, length 1-9
    const InpVal = Schema.validate(SubjectCode);
    if(InpVal.error){
        res.status(400).send(InpVal.error.details[0].message);
        return;
    }

    mongoFind(TimetableCollection, { subject:SubjectCode }, { catalog_nbr:1, _id:0 })
    .then( MongoRes => {
        if(mongoRes.length == 0){                               //if no matching data found
            res.status("404").send();
            return;
        }

        let courseArray = [];
        for (courses of mongoRes){
            courseArray.push({
                "COURSE CODE":courses["catalog_nbr"]
            });
        }
        res.send(courseArray);
    })
});

router.get('/subject/:scode/course/:ccode/timetable/:compcode?', (req, res) => {
    const SearchObj = { subject:req.params.scode, catalog_nbr:req.params.ccode }
    const CompCode = req.params.compcode;

    SearchObjSchema = Joi.object({
        subject: Joi.string().min(1).max(9).alphanum(),
        catalog_nbr: Joi.string().min(3).max(6).alphanum()
    })
    CompCodeSchema = Joi.string().min(1).max(5).alphanum().allow('');
    InpVal = SearchObjSchema.validate(SearchObj).error;
    if(InpVal)
        return res.status(400).send(InpVal.details[0].message);
    InpVal = CompCodeSchema.validate(CompCode).error;
    if(InpVal)
        return res.status(400).send("Component course not valid: "+InpVal.details[0].message);

    mongoFind(TimetableCollection, SearchObj, { course_info:1, _id:0 })
    .then( mongoRes=> {
        if(mongoRes.length == 0){                               //if no matching data found
            res.status("404").send();
            return;
        }

        let TimetableArray = [];
        for (CourseInfo of mongoRes[0]["course_info"]) {
            if(CompCode) {                                        //If compcode provided, then check for match
                if (CourseInfo["ssr_component"] == CompCode)
                    TimetableArray.push(CourseInfo);
            }
            else                                               //else simply push to array without check
                TimetableArray.push(CourseInfo);
        }
        res.send(TimetableArray);
    });
});

router.post('/schedule/:schcode/', (req, res) => {
    let SearchObj = { schedule: req.params.schcode };
    let ScheduleObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(SearchObj['schedule']);
    const splChk = checkSpecialChar( ScheduleObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    ScheduleObj["scheduledata"] = []
    mongoFind(ScheduleCollection, SearchObj, { _id:0 })
    .then( mongoRes => {
        if(mongoRes.length != 0) {                                              //If schedule exists, error
            res.status(400).send([{ERROR:"Schedule already exists"}]);
        }
        else{                                                                   //Else insert into collection
            mongoInsertOne( ScheduleCollection, ScheduleObj )
            .then( res.send([ScheduleObj]) );
        }
    });
});

router.put('/schedule/:schcode/scheduledata', (req, res) => {
    let SearchObj = { schedule: req.params.schcode };
    let ScheduleObj = { schedule: req.params.schcode, scheduledata: req.body };//Receive object of subject,course pairs as body

    ScheduleObjSchema = Joi.object({                                            //Create schema for input validation
        schedule: Joi.string().min(1).max(20),
        scheduledata: Joi.array().min(1).items(
            Joi.object({
                subject: Joi.string().min(1).max(9).alphanum(),
                course: Joi.string().min(3).max(6).alphanum()
            }))
    });
    InpVal = ScheduleObjSchema.validate(ScheduleObj);
    const splChk = checkSpecialChar( ScheduleObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule name invalid or data sent error: "+InpVal.error.details[0].message);

    mongoFind(ScheduleCollection, SearchObj, { _id:0 })
    .then( mongoRes => {
        if(mongoRes.length == 0)                                                //If schedule doesnt exist, error
            res.status("404").send("Schedule doesn't exists");
        else
            mongoUpdateOne(ScheduleCollection, SearchObj, { $set: ScheduleObj })
            .then( res.send(ScheduleObj["scheduledata"]) );
    });
});

router.get('/schedule/:schcode/scheduledata', (req, res) => {
    const ScheduleObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);                      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(ScheduleObj['schedule']);
    const splChk = checkSpecialChar( ScheduleObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    mongoFind(ScheduleCollection, ScheduleObj, { _id:0 })
    .then( mongoRes => {
        if (mongoRes.length == 0)                                               //If no schedule of name exists, send error
            res.status("404").send([{ERROR:"No schedule by that name"}]);
        else if(mongoRes[0]['scheduledata'] == 0){
            res.send([{ERROR:"No schedule data for that schedule"}]);
        }
        else                                                                    //Otherwise send data
            res.send(mongoRes[0]['scheduledata']);       
    });
});

router.delete('/schedule/:schcode', (req, res) => {
    const SearchObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);                      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(SearchObj['schedule']);
    const splChk = checkSpecialChar( SearchObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    mongoDeleteMany(ScheduleCollection, SearchObj)
    .then( mongoRes => {           
        result = mongoRes.result;                             
        if (result.n == 0)
            res.status("404").send("No schedule by that name");                 //If no schedule present, error
        else
            res.send([{ Message: "Successfully deleted "+SearchObj['schedule']+" schedule"}]);            //Otherwise delete record
    });
});

router.delete('/schedule', (req, res) => {
    mongoDeleteMany(ScheduleCollection, {})
    .then( mongoRes => {           
        result = mongoRes.result;                             
        res.send([{Message:"Successfully deleted "+result.n+" record(s)"}]);
    });
});

router.get('/schedule', (req, res) => {
    mongoFind(ScheduleCollection, {}, { _id:0 }).then( mongoRes => {
        let RetVal = [];
        for(element of mongoRes){
            Current = { schedule: element['schedule'] }
            Current['NoOfCourses'] = element['scheduledata'].length;
            RetVal.push(Current);
        }                                    
        res.send(RetVal);
    });
});

app.use(express.json())
app.use('/api', router)

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on ${port}...`))