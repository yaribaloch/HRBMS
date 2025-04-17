const {getUser} = require("../services/auth");
const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken"); 
const logedinUser = require("../utilities/logedinuser")
async function restrictToLoginedUserOnly(req, res, next){
    const token = req.header("Authorization") || req.header("authorization");
    console.log("Token: "+token);
    
    //check login session id in cookies
    if(!token) return res.send("Login plz.");
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    console.log("Token: "+decodedToken);
    //check user by login session id
    
    //const userCredentials = await getUser(token);
    req.userID= decodedToken._id;
    next();
}
function restrictToRole(roles = []){
 return  async function (req, res, next){
    const user = await logedinUser(req.userID);
    
    if(!roles.includes(user.userRole)) return res.send("Unauthorized.")

    return next();

 }
}
module.exports = {restrictToLoginedUserOnly, restrictToRole};