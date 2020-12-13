function check_admin(req, res, next){
    if(!req.isAuthenticated())
        res.status(401).send({'message':'Must be logged in as admin for this operation'})
    else if(req.user.admin == true)
        return next();
    else
        res.status(403).send({'message':'Operation requires admin access'})
}
function check_login(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.status(401).send({'message':'Must be logged in for this operation'})
}

function checkSpecialChar(str){
    const regex= RegExp("\\`|\\~|\\!|\\@|\\#|\\$|\\%|\\^|\\&|\\*|\\(|\\)|\\+|\\=|\\[|\\{|\\]|\\}|\\||\\\\|\\'|\\<|\\,|\\.|\\>|\\?|\\/|\\\"|\\;|\\:|\\s");
    if(regex.test(str))
        return true;
    else
        return false
}

function customLogger(req, res, next){
    console.log(Date().toLocaleString()+' '+req.method+' '+decodeURIComponent(req.url) )        //To log hits, with time
    next();
}

module.exports = {check_admin, check_login, checkSpecialChar, customLogger}