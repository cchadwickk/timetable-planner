var Course = require('../models/course')
var Account = require('../models/account')
var { checkSpecialChar } = require('../utilities/utilities')
var generatePassword = require('password-generator');

function createAdministrator(){                         //Create a default admin user with random password, print creds on console.
    const email = 'administrator'
    const password = generatePassword(12, false);
    const name = 'administrator';

    Account.deleteOne({name: name}).then();

    Account.register(new Account({ email : email, name: name, admin: true, email_is_verified: true}), password, function(err, account) {
        if (err) {
            console.log(err);
        }
        console.log("Admin Credentials: "+name+" "+password+"\n\n");
    });
}

function getUsers(req, res){
    Account.find({}, {_id:0, email:1, name:1, email_is_verified:1, course_list_count:1, active:1, admin: 1}).then(result => {
        res.send(result);
    })
}

function updateUser(req, res){
    var { email, admin, active } = req.body;
    if(!email)
        return res.status(400).send({"message":"Invalid data/empty : email"});
    
    searchObj = {email: email};
    updateObj = { admin: admin, active: active };

    Account.find(searchObj).then(result => {
        if(result.length==0)
            return res.status(400).send({"message":"No users found by that name"})
        else{
            Account.updateOne(searchObj, updateObj).then(result => {
                return res.send({"message":"User modified: "+email});
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

module.exports = { getUsers, updateUser, getReviews, updateReview, createAdministrator}