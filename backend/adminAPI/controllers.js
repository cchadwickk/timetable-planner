var Course = require('../models/course')
var Account = require('../models/account')
var { checkSpecialChar } = require('../utilities/utilities')

function getUsers(req, res){
    Account.find({}, {_id:0, email:1, name:1, email_is_verified:1, course_list_count:1, active:1, admin: 1}).then(result => {
        res.send(result);
    })
}

function updateUser(req, res){
    var { email, admin } = req.body;
    if( (!email||!admin) || checkSpecialChar(email))
        return res.status(400).send({"message":"Invalid data/empty : email or admin"});
    
    searchObj = {email: email};
    updateObj = { admin: admin };

    Account.find(searchObj).then(result => {
        if(result.length==0)
            return res.status(400).send({"message":"No users found by that name"})
        else{
            Account.updateOne(searchObj, updateObj).then(result => {
                return res.send({"message":"Admin privileges granted to "+email});
            });
        }
    });
}

function getReviews(req, res){
    searchObj = { reviews: { $exists: true, $not: { $size: 0 } } };
    projectionObj ={ _id:0, subject: 1, catalog_nbr: 1, reviews: 1 };
    Course.find( searchObj, projectionObj ).then(result => {
        res.send(result);
    })
}

function updateReview(req, res){
    var { email, subject, course, visible } = req.body;

    if( (!email||!subject||!course) || checkSpecialChar(subject) || checkSpecialChar(course) )
        return res.status(400).send({"message":"Invalid data/empty : email or or subject or course"});
    
    searchObj ={ subject: subject, catalog_nbr: course, reviews: { $elemMatch: { reviewerEmail: email } } };
    Course.find(searchObj).then(result => {
        if(result.length == 0)
            res.status(400).send({"message":"No review found for that combination of params"});
        else{
            newReviews = []
            result[0].reviews.forEach(element => {
                if(element.reviewerEmail == email)
                    element.visible = visible;
                newReviews.push(element)
            });
            Course.updateOne( searchObj, { reviews: newReviews } ).then(result => {
                res.send({"message":"Changed review visibility"});
            });
        }
    });
}

module.exports = { getUsers, updateUser, getReviews, updateReview}