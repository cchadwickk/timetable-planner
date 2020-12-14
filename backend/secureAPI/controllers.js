var Course = require('../models/course')
var CourseList = require('../models/courseList')
var Account = require('../models/account')
var { checkSpecialChar } = require('../utilities/utilities')

function createCourseList(req, res){
    var { courseListName, listData, private, courseListDesc, year} = req.body;
    if( (!courseListName) || checkSpecialChar(courseListName))
        return res.status(400).send({"message":"Invalid data/empty : courseListName or listData"});
    if(req.user.course_list_count == 20)
        return res.status(400).send({"message":"CourseLists limit reached, delete a courselist first"});

    searchObj = { courseListName: courseListName };
    insertObj = { listData: listData };
    if(private !== null)
        insertObj["private"] = private;

    CourseList.find(searchObj).then(result => {
        if(result.length){                                                             //If there exists a courselist by that name
            if(result[0].creatorEmail != req.user.email)                               //error if courselistname used by other user
                return res.status(400).send({"message": "courseListName already in use by another user"});
            else{                                                                   //Update if courselistname used by current user
                CourseList.updateOne(searchObj, insertObj).then(result => {
                    return res.send({"message": "courseList updated successfully"});
                })
            }
        }
        else{                                                                       //If no courselistname by that name, insert
            insertObj['courseListName']= courseListName;
            insertObj['creatorEmail']= req.user.email;
            insertObj['creatorName']=req.user.name;
            insertObj['courseListDesc']=courseListDesc;
            CourseList.create(insertObj).then(result => {
                req.user.course_list_count += 1;
                Account.updateOne({email: req.user.email}, {course_list_count: req.user.course_list_count}).exec();
                return res.send({"message": "courseList inserted successfully"});
            });
        }
    });
}

function deleteCourseList(req, res){
    var { courseListName } = req.params;
    if(!courseListName || checkSpecialChar(courseListName))
        return res.status(400).send({"message":"Invalid data/empty : courseListName"});
    searchObj = { courseListName: courseListName };

    CourseList.find(searchObj).then(result => {
        if(result.length && result[0].creatorEmail==req.user.email){                   //If there exists a courselist by that name
            CourseList.deleteOne(searchObj).then(result => {
                return res.send({"message": "CourseList: "+courseListName+" deleted"});
            })
        }
        else                                                                       //If no courselistname by that name, reply
            return res.status(400).send({"message": "No courseList by that name found in your account"});
    });
}

function getCourseLists(req, res){
    searchObj = { creatorEmail: req.user.email };
    projectionObj = { _id: 0, creatorEmail: 0, creatorName: 0 };
    CourseList.find(searchObj, projectionObj).then(result => {
        resultCopy=JSON.parse(JSON.stringify(result));
        for(let ind in resultCopy){
            resultCopy[ind]['noOfCourses']=resultCopy[ind].listData.length;
        };
        res.send(resultCopy);
    })
}

function privateCourseTimetable(req, res){
    courseListName = req.params.courseListName;
    if(!courseListName || checkSpecialChar(courseListName))
        return res.status(400).send({"message":"Invalid data in courseListName, or empty"});
    searchterm = { courseListName: courseListName, creatorEmail: req.user.email };
    CourseList.find(searchterm, { listData: 1 })            //Get the courselist for the request
    .then( mainResult => {
        searchterm = [];
        if(mainResult.length == 0)
            return res.send({"message": "No courseList by that name in your account"})
        if(mainResult[0].listData.length == 0)                  //Check if no courses in the list
            return res.send([]);
            mainResult[0].listData.forEach(element => {             //Iterate over the list to form a search document
            searchterm.push({ 
                'subject':element.subject,
                'catalog_nbr': element.course
            });
        });
        searchterm = { $or: searchterm };                   //Search mongo for documents that match
        Course.find(searchterm, { catalog_description:0, descr:0, className:0,reviews:0, _id:0 })
        .then( innerResult => {
            let innerResultCopy=JSON.parse(JSON.stringify(innerResult))
            mainResult[0].listData.forEach(element => {             //Iterate over subject,course combo
                if(element.year){
                    index=innerResultCopy.findIndex(x => (x.catalog_nbr==element.course))
                    innerResultCopy[index]['year']=element.year;
                }
            });
            res.send(innerResultCopy);
        });
    });
}

function addReview(req, res){
    var { subject, course, reviewContent } = req.body;
    if( (!subject||!course||!reviewContent) || checkSpecialChar(subject) || checkSpecialChar(course) )
        return res.status(400).send({"message":"Invalid data/empty : subject or course or reviewContent"});
    
    const {email, name} = req.user;
    searchObj = { subject: subject, catalog_nbr: course };
    setObj = { $push: { reviews: { content:reviewContent, reviewerEmail: email, reviewerName: name} } }

    Course.find(searchObj).then(result =>{                                                  //Find the course
        if(result.length == 0)
            return res.status(400).send({"message":"Subject Course combination does not exist."})
        else{
            var reviewExistsFlag=false;
            for(element of result[0].reviews){                                              //Loop over reviews to check existing review
                if(element.reviewerEmail==email){
                    reviewExistsFlag=true;
                    return res.status(400).send({"message":"You already have a review for this course."});
                }
            }
            if(!reviewExistsFlag){                                                          //If no review exists, add review
                Course.updateOne(searchObj,setObj).then(result => {
                    return res.send({"message":"Review added successfully."})
                });
            }
        }
    });

}

module.exports = { createCourseList, addReview, privateCourseTimetable, getCourseLists, deleteCourseList }