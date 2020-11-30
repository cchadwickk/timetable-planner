var Account = require('../models/account');
var to = require('await-to-js').to;

const strategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_API_URL}/auth/google/callback`
}

const verifyCallback = async function(accessToken, refreshToken, profile, done) {
    const verifiedEmail = profile.emails.find(email => email.verified) || profile.emails[0]

    console.log("Logging in using google user");
    let [err, account] = await to(Account.findOne(
        { googleId: profile.id }).exec());

    if(!account && !err){
        console.log("Could not find google user, checking and updating email user");
        [err, account] = await to(Account.findOneAndUpdate(
            { email: verifiedEmail.value }, 
            { $set: { googleId: profile.id } }
        ).exec());
    }
    
    if(!account && !err){
        console.log("Could not find email user either, creating new google user");
        [err, account] = await to(Account.create({
                googleId: profile.id,
                name: profile.name.givenName+" "+profile.name.familyName,
                email: verifiedEmail.value,
                password: null
            }).exec());
    }
    return done(err, account);
}

module.exports = { strategyOptions, verifyCallback }