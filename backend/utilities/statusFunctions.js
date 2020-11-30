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

module.exports = {check_admin, check_login}