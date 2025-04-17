const {getUser} = require("../services/auth");
const {User} = require("../models/userModel");
async function logedinUser(userID){
       const user = await User.findOne(userID);
       return user;
   
    }
module.exports = logedinUser;