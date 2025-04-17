const {Room} = require("../models/roomModel");
async function bookingPrice(start, end, rqstdRoomNos, res){
    let roomsPrice=0;
    for(const roonNo of rqstdRoomNos) {
        const room = await Room.findOne({_id : roonNo}, {"roomPrice":1});            
        roomsPrice += room.roomPrice;     
    };        
      
    if(start === end){
        
        return 1*roomsPrice;
    }else if(start < end){
        const msInDay  =1000*60*60*24;
        const bTenure= Math.floor(Date.parse(end) - Date.parse(start))/msInDay;
        return (bTenure+1)*roomsPrice;
    }else res.send("End date must be equal to or greater than start date.")
}
module.exports = {bookingPrice,}