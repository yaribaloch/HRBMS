async function bookingValidation(par1, par2){
    const room = await Room.find({roomNumber : par1});
    const user = await User.find({_id : par2});
    if(room && user){
        return true;
    }else false;
}
module.exports = {bookingValidation,}