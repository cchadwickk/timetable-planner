var passport = require('passport');
var Account = require('../models/account');
var crypto = require('./crypto');
const sendmail = require('sendmail')();
 
function emailsender(emailid, string){
    htmlcontent = 'Click link to verify: '+process.env.BASE_API_URL+'/auth/verifyEmail/'+string;
    sendmail({
        from: 'no-reply@ece9065.tk',
        to: emailid,
        subject: 'Verify email for Western Timetable',
        html: htmlcontent,
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
    console.log(htmlcontent);
}

function register(req, res) {
    const {email, password, name} = req.body;
    if (!/\b\w+\@\w+\.\w+(?:\.\w+)?\b/.test(email)) {
        return res.status(400).send({'message':"Email invalid"})
    } 
    else if (password.length < 5 || password.length > 20) {
        return res.status(400).send({'message':"Password length invalid"})
    }
    Account.register(new Account({ email : email, name: name}), password, function(err, account) {
        if (err) {
            if (err.name == 'UserExistsError')
                return res.status(409).send({'message': err.message});
            console.log(err);
            return res.status(500).json(err)
        }
        emailsender(email, crypto.encrypt(email));
        res.status(200).json({'message': "Registered successfully, verify email"});
    });
};

function login(req, res) {
    if(req.user.email_is_verified == false){
        req.logout();
        return res.status(401).send({'message':'Email not verified, cannot login'})
    }
    res.send({'message':'Login Successful'});
}

function logout(req, res) {
    req.logout();
    res.send({'message':'Logout Successful'});
}

function changePassword(req, res){
    const {oldPassword, newPassword} = req.body;
    if (!newPassword || newPassword.length < 5 || newPassword.length > 20) {
        return res.status(400).send({'message':"New Password length invalid"})
    }
    var user=req.user;
    user.changePassword(oldPassword, newPassword, function(err){
        if(err)
            res.status(400).send({'message': err.message});
        else
            res.send({'message':"Password successfully changed"});
    });
}

function verifyEmail(req, res){
    email = crypto.decrypt(req.params.verifystring);
    Account.findOneAndUpdate({email: email}, { $set: { email_is_verified: true }} ,function (err, account) {
        console.log("Email verify query executed");
    });
}

module.exports = { register, login , logout, changePassword, verifyEmail }