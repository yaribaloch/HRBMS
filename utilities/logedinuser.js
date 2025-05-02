const {User} = require("../models/userModel");
async function logedinUser(userID){
       const user = await User.findOne({_id:userID});
       return user;
    }
module.exports = logedinUser;