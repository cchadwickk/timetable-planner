var Joi = require('joi')
var Course = require('../models/course')
var CourseList = require('../models/courseList')
var { checkSpecialChar } = require('../utilities/utilities')

function searchMain(req, res) {
    var { subject, course } = req.query;
    searchterm = {};
    if( (!subject&&!course) || checkSpecialChar(subject) || checkSpecialChar(course))
        return res.status(400).send({"message":"Invalid data in subject or course, or both empty"})
    if(subject)
        searchterm['subject']=subject;
    if(course)
        searchterm['catalog_nbr']={ $regex: new RegExp(course,'i') };
    Course.find(searchterm, { _id:0, reviews: { reviewerEmail: 0}})
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
    keyword = req.params.keyword;
    if(!keyword || checkSpecialChar(keyword))
        return res.status(400).send({"message":"Invalid data in keyword, or empty"})
    searchterm = {
        $or: 
        [
            { 'catalog_nbr' : { $regex: new RegExp(keyword,'i') } },
            { 'className' : { $regex: new RegExp(keyword,'i') } }
        ] 
    };
    Course.find(searchterm, { _id:0 , reviews: { reviewerEmail: 0} })
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

function searchByKeywordFuzzy(req, res){
    keyword = req.params.keyword;
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
    CourseList.find(searchterm, { _id:0, creatorEmail: 0, private: 0 } )
    .then( result => {
        resultCopy=JSON.parse(JSON.stringify(result));
        for(let ind in resultCopy){
            resultCopy[ind]['noOfCourses']=resultCopy[ind].listData.length;
        };
        res.send(resultCopy);
    });
}

function publicCourseTimetable(req, res){
    courseListName = req.params.courseListName;
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
        Course.find(searchterm, { reviews:0, _id:0 })
        .then( result2 => {
            res.send(result2);
        });
    });
}

module.exports = {searchMain, checkSpecialChar, searchByKeyword, publicCourseLists, publicCourseTimetable, searchByKeywordFuzzy}