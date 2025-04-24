const {User} = require("../models/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const sendEmail = require("../utilities/sendEmail")
const generateOTP = require("../utilities/generateOTP")
const {setUser} = require("../services/auth");
const { default: mongoose } = require("mongoose");
const { response } = require("express");
async function handleUserLogin(req, res) {
    const {userEmail, userPassword} = req.body;
    
    // if(!mongoose.isValidObjectId(_id))
    //     return res.status(500).json({
    //     status: false,
    //     message:"Wrong user ID."
    // })
    const user = await User.findOne({userEmail: userEmail});

    
    //user check

    if(!user)
        return res.send("Signup, please.");
    
    if(!user.authStatus){
        const otp = generateOTP();
        if(!otp) return res.status(300).json({
            status: false,
            message: "OTP cann't be generated."
        })
        user.userOTP = otp;
        user.save();
        const emailSent = await sendEmail(
            userEmail,
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
            message: "Please check email to verify your account."
        });
    }
    console.log(user);
    console.log("Password: "+user.userPassword);
    
    const isPasswordMatched = bcrypt.compare(userPassword,user.userPassword) 

    
    if(isPasswordMatched){
        
        const accessToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            //const token = setUser(user);
            //login response
            //res.cookie("token", token)
            return res.status(200).json({
                status: true,
                message: "Logged in, token created successfully.",
                accessToken: accessToken
            })
        }else{
            return res.status(500).json({
                status: false,
                message: "Incorrect Password."
            })
        }
    }
async function handleLogin(req, res) {
    res.send("You are in login screen.")
}
module.exports = {handleLogin, handleUserLogin}