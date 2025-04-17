const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    userName: {
        type:String
    },
    userEmail: {
        type:String
    },
    userPassword: {
        type:String
    },
    userRole: {
        type:String
    },
    userContact: {
        type:Number
    },
    userBalance: {
        type:Number
    }
})
userSchema.pre("save", async function(next){
    const user = this;
    try{
        const saltRound = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.userPassword, saltRound);
        user.userPassword = hashPassword;
    }
    catch(error){
        next(error);  
    }
})
const User = mongoose.model("User", userSchema);


module.exports = {User};