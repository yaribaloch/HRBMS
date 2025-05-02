async function handleHome(req, res){
    try{
        res.status(200).json({
            status: true,
            message: "You are on home page."
        });
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}
module.exports = handleHome;