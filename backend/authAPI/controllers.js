var passport = require('passport');
var Account = require('../models/account');

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
            if (err.name == UserExistsError)
                return res.status(409).send({'message': err.message});
            return res.status(500).json(err)
        }
        res.status(200).json({'message': "Registered successfully"});
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

module.exports = { register, login , logout}