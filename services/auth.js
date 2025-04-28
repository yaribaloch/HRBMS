const jwt = require("jsonwebtoken")
const key = "yarikhan"
function setUser(user){
    return jwt.sign({
        _id: user._id,
        userEmail: user.userEmail
    }, key);
}

function  getUser(token){
    if(!token) return null;
    return jwt.verify(token, key);
}

module.exports = {setUser, getUser}