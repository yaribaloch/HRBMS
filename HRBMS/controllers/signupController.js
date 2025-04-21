const {User} = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utilities/sendEmail")
const generateOTP = require("../utilities/generateOTP")
const {signupAuthSchema} = require("../utilities/validationSchema")
async function handleUserSignup(req, res){

    try{
        const result =await signupAuthSchema.validateAsync(req.body);
        console.log(result);
        const userExisting = await User.findOne({userEmail: result.userEmail});
        console.log("User >"+userExisting);
        
        if(userExisting){
            if(userExisting.autStatus) return res.status(500).json({
                status: false,
                message: "User already exists. Please continue to login."
            })

            const otp = generateOTP();
            if(!otp) return res.status(300).json({
                status: false,
                message: "OTP cann't be generated."
            })
            
            const email =await sendEmail(userExisting.userEmail, "Verification OTP", `Use this OTP ${otp} to verify your account.`)
            if(!email) return res.status(300).json({
                status: false,
                Message: "User already exists. Couldn't send verification email."
            })
            userExisting.userOTP = otp;
            userExisting.save();
           // User.updateOne({userEmail: result.userEmail}, {userOPT:otp});
           return res.status(409).json({
            status: false,
            message: "User already registered! Please check email to very your account."
           })
        }
        
        const otp = generateOTP();
        if(!otp) return res.status(300).json({
            status: false,
            message: "OTP cann't be generated."
        })
//        User.findOne({userEmail: result.userEmail}, {userOPT:otp});
//            let newuserID = await generateuserID();
        const encryptedPassword = await bcrypt.hash(result.userPassword, 10)
        const user = new User({
 //           userID: newuserID,
            userName: result.userName,
            userEmail: result.userEmail,
            userPassword: encryptedPassword,
            userRole: "Customer",
            userContact: result.userContact,
            userBalance: 0.00,
            userOTP: otp
        });
        await user.save();
        
        const email = sendEmail(result.userEmail.toLowerCase(),"Verification OTP", `Use this OTP ${otp} to verify your account.`)
        if(!email) return res.status(300).json({
            status: true,
            message: "Couldn't send verification email."
        })
        return res.status(200).json({
            status: true,
            message: "User created, Please check email to verify your account."
        });
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