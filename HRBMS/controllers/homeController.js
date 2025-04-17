const {getUser} = require("../services/auth")
async function handleHome(req, res){
    try{
        const token = req.cookies?.token;
        const user = getUser(token);
        res.json(user);
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}


module.exports = handleHome;