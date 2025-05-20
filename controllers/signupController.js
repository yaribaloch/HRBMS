const {User} = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utilities/sendEmail")
const generateOTP = require("../utilities/generateOTP")
const {signupAuthSchema, OTPSchema} = require("../utilities/validationSchema");
const Joi = require("joi");
async function handleUserSignup(req, res){
    try{
        const result =await signupAuthSchema.validateAsync(req.body);
        const userExisting = await User.findOne({userEmail: result.userEmail});
        if(userExisting){
            if(userExisting.authStatus) return res.status(500).json({
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

        //const encryptedPassword = await bcrypt.hash(result.userPassword, 10)
        const user = new User({
            userName: result.userName,
            userEmail: result.userEmail,
            userPassword: result.userPassword,
            userRole: "Customer",
            userContact: result.userContact,
            userBalance: 0.00,
            userOTP: otp
        });
        await user.save();
        // Send OTP to email
        const emailSent = await sendEmail(
        result.userEmail,
        "Verification OTP",     
        `Use this OTP ${otp} to verify your account.`
      );

      if (!emailSent) {
        return res.status(500).json({
          status: false,
          message: "Failed to send verification email.",
        });
      }
        
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

async function handleSignup(req, res) {
    res.send("You are in signup screen.")
}
async function  handleOTPverification(req, res) {
    const result = await OTPSchema.validateAsync(req.body)
    const user = await User.findOne({userOTP: result.OTP})
    
    if(!user) return res.status(400).json({
        status: false,
        message: "OTP not matched."
    })

    user.userOTP = "";
    user.authStatus = true
    await user.save();
    return res.status(200).json({
        status: true,
        message: "Account has been verified. Please login!"
    })
}
module.exports = {handleSignup, handleUserSignup, handleOTPverification}