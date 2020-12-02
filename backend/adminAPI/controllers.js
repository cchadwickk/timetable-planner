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

}

module.exports = { getUsers, updateUser, getReviews, updateReview}