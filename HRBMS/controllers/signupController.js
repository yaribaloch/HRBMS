const {User} = require("../models/userModel");
const bcrypt = require("bcryptjs");
const {signupAuthSchema} = require("../utilities/validationSchema")
async function handleUserSignup(req, res){

    try{
        const result =await signupAuthSchema.validateAsync(req.body);
        console.log(result);
//            let newuserID = await generateuserID();
            const user = new User({
 //           userID: newuserID,
            userName: result.userName,
            userEmail: result.userEmail,
            userPassword: result.userPassword,
            userRole: "Customer",
            userContact: result.userContact,
            userBalance: 0.00,
        });
        const data = await user.save();
        return res.json(data);
    }
        catch (error) {
            if(error.isJoi === true) error.status = 422
            console.error("Error saving user:", error);
        }
}
// async function generateuserID() {
//     const totallUsers = await User.countDocuments();
//     const lastUser = await User.find().skip(totallUsers-1);

//     let lastuserID = lastUser[0].userID+1;
    
//     const startinguserID = 101;
//     if(lastuserID){    
//         return lastuserID;
//     }else {return startinguserID}
// }
async function handleSignup(req, res) {
    res.send("You are in signup screen.")
}
module.exports = {handleSignup, handleUserSignup}