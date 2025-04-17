const Booking = require("../models/bookingModel");
const {User} = require("../models/userModel");
const roles = ["Admin", "Hotel Manager", "Customer"]
const logedInUser = require("../utilities/logedinuser")
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
        });
        const data = await user.save();
        res.json(data);
    }else res.send("Described role does not exit.")
    }
        catch (error) {
            console.error("Error saving user:", error);
        }
}
async function handleSignUp(req, res){

    try{
//            let newuserID = await generateuserID();
            const user = new User({
//          userID: newuserID,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
            userRole: "Customer",
            userContact: req.body.userContact,
            userBalance: 0.00,
        });
        const data = await user.save();
        res.json(data);
    }
        catch (error) {
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
        const newEmail = req.body.newEmail;
        const userPasswod = req.body.userPassword;
        const user = await logedInUser(req.userID);
        //Verify User Password
        await bcrypt.compare(userPasswod, user.userPassword, async function(err, result){
            if(err){ console.log(err);}
            if(result){
                //Update To New Email
                await User.updateOne({userID: user.userID}, {userEmail: newEmail});
                return res.json(await User.findOne({_id: user.userID}));
            }else res.send("Password missmatched!")
        })

    }
    catch(error){
        console.log("error is: "+error);
        
    }
}
async function handleChangeUserPassword(req, res) {
    
    try{  
        const newPassword = req.body.new_password;
        const oldPassword = req.body.old_password;
        const user = await logedInUser(req.userID);
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
        const user = await logedInUser(req.userID);
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
        console.log("error is: "+error);
        
    }
}
module.exports = {
    handleAddUser, 
    handleGetAllUsers, 
    handleFindUser, 
    handleChangeUserRole, 
    handleSignUp,
    handleChangeUserEmail,
    handleChangeUserPassword,
    handleDeleteUserAccount
}