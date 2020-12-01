var Joi = require('joi')
var Course = require('../models/course')
var CourseList = require('../models/courseList')
var { checkSpecialChar } = require('../utilities/utilities')

function searchMain(req, res) {
    subject = req.body.subject;
    course = req.body.course;
    searchterm = {};
    if( (!subject&&!course) || checkSpecialChar(subject) || checkSpecialChar(course))
        return res.status(400).send({"message":"Invalid data in subject or course, or empty"})
    if(subject)
        searchterm['subject']=subject;
    if(course)
        searchterm['catalog_nbr']={ $regex: new RegExp(course,'i') };
    Course.find(searchterm, { _id:0 })
    .then( result => {
        for(element in result){
            var newReview=[]
            for(index in result[element].reviews){
                if(result[element].reviews[index].visible == true)
                    newReview.push(result[element].reviews[index])
            };
            result[element].reviews=newReview;
        };
        res.send(result);
    });
}

function searchByKeyword(req, res){
    keyword = req.body.keyword;
    if(!keyword || checkSpecialChar(keyword))
        return res.status(400).send({"message":"Invalid data in keyword, or empty"})
    searchterm = {
        $or: 
        [
            { 'catalog_nbr' : { $regex: new RegExp(keyword,'i') } },
            { 'className' : { $regex: new RegExp(keyword,'i') } }
        ] 
    };
    Course.find(searchterm, { _id:0 })
    .then( result => {
        res.send(result);
    });
}

function searchByKeywordFuzzy(req, res){
    keyword = req.body.keyword;
    if(!keyword || checkSpecialChar(keyword))
        return res.status(400).send({"message":"Invalid data in keyword, or empty"})
    Course.fuzzySearch(keyword)
    .then( result => {
        res.send(result);
    });   
}

function publicCourseLists(req, res){
    searchterm = {
        private: false
    }
    CourseList.find(searchterm, { _id:0 , creatorEmail: 0, private: 0 } )
    .then( result => {
        res.send(result);
    });
}

function publicCourseTimetable(req, res){
    courseListName = req.body.courseListName;
    if(!courseListName || checkSpecialChar(courseListName))
        return res.status(400).send({"message":"Invalid data in courseListName, or empty"});
    searchterm = { courseListName: courseListName , private: false};
    CourseList.find(searchterm, { listData: 1 })            //Get the courselist for the request
    .then( result => {
        searchterm = [];
        if(result.length == 0)
            return res.send({"message": "No public courseList by that name"})
        result[0].listData.forEach(element => {             //Iterate over the list to form a search document
            searchterm.push({ 
                'subject':element.subject,
                'catalog_nbr': element.course
            });
        });
        searchterm = { $or: searchterm };                   //Search mongo for documents that match
        Course.find(searchterm, { 'subject': 1, 'catalog_nbr': 1, 'course_info': 1, _id:0 })
        .then( result2 => {
            res.send(result2);
        });
    });
}



function getCourses(req, res) {
    const SubjectCode = req.params.scode;

    const Schema = Joi.string().min(1).max(9).alphanum();      //Check that subject code is alnum string, length 1-9
    const InpVal = Schema.validate(SubjectCode);
    if(InpVal.error){
        res.status(400).send(InpVal.error.details[0].message);
        return;
    }

    mango.Find(TimetableCollection, { subject:SubjectCode }, { catalog_nbr:1, _id:0 })
    .then( MongoRes => {
        if(mongoRes.length == 0)                               //if no matching data found
            return res.status("404").send();

        let courseArray = [];
        for (courses of mongoRes){
            courseArray.push({
                "COURSE CODE":courses["catalog_nbr"]
            });
        }
        res.send(courseArray);
    })
}

function getTimetables(req, res) {
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

    mango.Find(TimetableCollection, SearchObj, { course_info:1, _id:0 })
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
}

function createSchedule(req, res) {
    let SearchObj = { schedule: req.params.schcode };
    let ScheduleObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(SearchObj['schedule']);
    const splChk = checkSpecialChar( ScheduleObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    ScheduleObj["scheduledata"] = []
    mango.Find(ScheduleCollection, SearchObj, { _id:0 })
    .then( mongoRes => {
        if(mongoRes.length != 0) {                                              //If schedule exists, error
            res.status(400).send([{ERROR:"Schedule already exists"}]);
        }
        else{                                                                   //Else insert into collection
            mango.InsertOne( ScheduleCollection, ScheduleObj )
            .then( res.send([ScheduleObj]) );
        }
    });
}

function updateSchedule(req, res) {
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

    mango.Find(ScheduleCollection, SearchObj, { _id:0 })
    .then( mongoRes => {
        if(mongoRes.length == 0)                                                //If schedule doesnt exist, error
            res.status("404").send("Schedule doesn't exists");
        else
            mango.UpdateOne(ScheduleCollection, SearchObj, { $set: ScheduleObj })
            .then( res.send(ScheduleObj["scheduledata"]) );
    });
}

function getScheduleData(req, res) {
    const ScheduleObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);                      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(ScheduleObj['schedule']);
    const splChk = checkSpecialChar( ScheduleObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    mango.Find(ScheduleCollection, ScheduleObj, { _id:0 })
    .then( mongoRes => {
        if (mongoRes.length == 0)                                               //If no schedule of name exists, send error
            res.status("404").send([{ERROR:"No schedule by that name"}]);
        else if(mongoRes[0]['scheduledata'] == 0){
            res.send([{ERROR:"No schedule data for that schedule"}]);
        }
        else                                                                    //Otherwise send data
            res.send(mongoRes[0]['scheduledata']);       
    });
}

function deleteSchedule(req, res) {
    const SearchObj = { schedule: req.params.schcode};

    const Schema = Joi.string().min(1).max(20);                      //Check that schedule code is alnum string, length 1-20
    const InpVal = Schema.validate(SearchObj['schedule']);
    const splChk = checkSpecialChar( SearchObj['schedule'] );
    if(InpVal.error || splChk)
        return res.status(400).send("Schedule not valid or special character in schedule code: "+InpVal.error.details[0].message);

    mango.DeleteMany(ScheduleCollection, SearchObj)
    .then( mongoRes => {           
        result = mongoRes.result;                             
        if (result.n == 0)
            res.status("404").send("No schedule by that name");                 //If no schedule present, error
        else
            res.send([{ Message: "Successfully deleted "+SearchObj['schedule']+" schedule"}]);            //Otherwise delete record
    });
}

function deleteAllSchedule(req, res) {
    mango.DeleteMany(ScheduleCollection, {})
    .then( mongoRes => {           
        result = mongoRes.result;                             
        res.send([{Message:"Successfully deleted "+result.n+" record(s)"}]);
    });
}

function getAllSchedule(req, res) {
    mango.Find(ScheduleCollection, {}, { _id:0 }).then( mongoRes => {
        let RetVal = [];
        for(element of mongoRes){
            Current = {};
            Current['ScheduleName'] = element['schedule']; 
            Current['NoOfCourses'] = element['scheduledata'].length;
            RetVal.push(Current);
        }                                    
        res.send(RetVal);
    });
}

module.exports = {searchMain, checkSpecialChar, searchByKeyword, publicCourseLists, publicCourseTimetable, searchByKeywordFuzzy}