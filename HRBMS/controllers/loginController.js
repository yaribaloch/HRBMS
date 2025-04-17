const {User} = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const {setUser} = require("../services/auth");
const { default: mongoose } = require("mongoose");
async function handleUserLogin(req, res) {
    const {_id, userPassword} = req.body;
    
    if(!mongoose.isValidObjectId(_id))
        return res.status(500).json({
        status: false,
        message:"Wrong user ID."
    })
    const user = await User.findOne({_id: _id});
    //user check

    if(!user)
        return res.send("Signup, please.");
    bcrypt.compare(userPassword,user.userPassword, function(err, result){
        if(err){console.log(err);
        }
        if(result){
            console.log("KEY"+ _id);
            
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
            return res.send("Invalid password.");
        }
    })
}
async function handleLogin(req, res) {
    res.send("You are in login screen.")
}
module.exports = {handleLogin, handleUserLogin}