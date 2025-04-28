const { required } = require("@hapi/joi/lib/base");
const Booking = require("../models/bookingModel");
const {User} = require("../models/userModel");
const roles = ["Admin", "Hotel Manager", "Customer"]
const logedinUser = require("../utilities/logedinuser")
const bcrypt = require("bcryptjs")
async function handleAddUser(req, res){
    try{

        if(roles.includes(req.body.userRole)){
            const user = new User({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
            userRole: req.body.userRole,
            userContact: req.body.userContact,
            userBalance: req.body.userBalance,
            authStatus: true
        });
        const data = await user.save();
        res.json(data);
    }else res.send("Described role does not exit.")
    }
        catch (error) {
            console.error("Error saving user:", error);
        }
}
async function handleGetAllUsers(req, res) {
    try{
        const allUsers = await User.find({});
        return res.json(allUsers);}
    catch(error){
        console.log("error is: "+error);
        
    }
}
async function handleFindUser(req, res) {
    
    try{  
        const searchedUserID = req.body.userID;
        console.log(searchedUserID);
        
        const userSearched = await User.findOne({_id: searchedUserID});
        console.log(userSearched);
        
        if(userSearched==null){
            res.send("No such a user.")
        }else{ res.send(userSearched);}
    }
    catch(error){
        console.log("error is: "+error);
        
    }
}
async function checkuserID(id) {
    const user = await User.findOne({_id: id});
    if(user==null){ return true;}
    else {return false;}
}
async function handleChangeUserRole(req, res) {
    
    try{  
        const newRole = req.body.userRole;
        const userID = req.body.userID;
        //Check For A Valid User ID
        if(checkuserID(userID)){
            //Check For Valid New Role
            if(roles.includes(newRole)){
                //Update Role Of The User Specifies by userID 
                await User.updateOne({_id: userID}, {userRole: newRole});
                return res.json("Role assigned.");
            }else res.send("Invalid Role.")
        }else res.send("No such a user found.")
    }
    catch(error){
        console.log("error is: "+error);
        
    }
}
async function handleChangeUserEmail(req, res) {
    
    try{  
        const newEmail = req.body.newEmail.toLowerCase();
        const userPassword = req.body.userPassword;
        const user = await logedinUser(req.userID);
        if(!user) return res.status(300).json({
            status: false,
            message: "Oops! could not get user."
        })

        //Verify User Password
        const passwordCheck = await bcrypt.compare(userPassword, user.userPassword);
        if(!passwordCheck) return res.status(500).json({
            status: false,
            message: "Password missmatched!"})
        //Update To New Email
         await User.updateOne({_id: req.userID}, {userEmail: newEmail});
         const  updatedUser = await User.find({_id: req.userID});
         return res.status(200).json({
             status: true,
             user:  updatedUser
        });
    }
    catch(error){
        console.log("error is: "+error);
    }
}
async function handleChangeUserPassword(req, res) {
    
    try{  
        const newPassword = req.body.new_password;
        const oldPassword = req.body.old_password;
        const user = await logedinUser(req.userID);
        //Verify User Password
        await bcrypt.compare(oldPassword, user.userPassword, async function(err, result){
            if(err){ console.log(err);}
            if(result){
                //Encript New Password
                const saltRound = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(newPassword, saltRound)
                //Update To New Password
                await User.updateOne({_id: user._id}, {userPassword: hashPassword});
                return res.json("Password updated succesfully.");
            }else res.send("Password missmatched!")
        })

    }
    catch(error){
        console.log("error is: "+error);
        
    }
}
async function handleDeleteUserAccount(req, res) {
    
    try{  
        const userPassword = req.body.userPassword;
        const confirmDelte = req.body.confirmDelte;
        const user = await logedinUser(req.userID);
        //Verify User Password
        if(confirmDelte=="delete"){
            await bcrypt.compare(userPassword, user.userPassword, async function(err, result){
            if(err){ console.log(err);}
            if(result){
                //Delete User Record
                res.clearCookie("token");
                const userWithBookings = await User.aggregate([
                {$match:{
                    "userID": user._id
                }},
                {$lookup:{
                    from: "bookings",
                    localField: "_id",
                    foreignField: "userID",
                    as: "Bookings"
                }},
                {$project :{
                    "_id": 1,
                    Bookings:{
                        "bookingId": 1
                    }
                    }
                }
            ]);
                await userWithBookings[0].Bookings.forEach(booking=>{
                    Booking.deleteOne({bookingId: booking.bookingId})
                })
                await User.deleteOne({_id: user._id});
                return res.json("Account along with all bookings deleted.");
            }else res.send("Password missmatched!")
            })
        }else res.send("Deletion not confirmed!")
    }
    catch(error){
        console.log("error is: "+error)
    }
}
async function handleAddBalance(req, res) {
    const {userEmail, amount} = req.body;
    const user = await User.findOne({userEmail: userEmail})
    if(!user) return res.status(400).json({
        status: false,
        message: "User not found."
    })
    user.userBalance += amount;
    await user.save();
    return res.status(300).json({
        status: true,
        message: `Amount of $${amount} added in account.`
    })
}
module.exports = {
    handleAddUser, 
    handleGetAllUsers, 
    handleFindUser, 
    handleChangeUserRole, 
    handleChangeUserEmail,
    handleChangeUserPassword,
    handleDeleteUserAccount,
    handleAddBalance
}