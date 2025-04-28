const Booking = require("../models/bookingModel");
const {Room} = require("../models/roomModel");
async function roomsAvailable(start, end, category, bookingExcepId) {
    try{
        //data required
        const allBookings = await Booking.find({});
        var availableRooms=[];
        //Get All Rooms
        var allRooms=Room.find({});
        //Separate All Room No.s In Selected Category
        (await allRooms).forEach(room=>{
            if(category === room.roomCategory)
            {
                availableRooms.push(room._id); 
            }else if(category == null || category == undefined){
                availableRooms.push(room._id);
            }
        });
        //Remove Unavailable Room's no. In Selected Category
        await allBookings?.forEach(booking=>{
            if(booking.bookingId!=bookingExcepId){
                const bookStart = Date.parse(booking.bookingStartDate);
                const bookEnd = Date.parse(booking.bookingEndDate);
                if((end < start) || (start >= bookStart && start <= bookEnd) || (end >= bookStart && end <= bookEnd)){
                const index = availableRooms.indexOf(booking.roomNumber);
                    if (index>=0){
                    availableRooms.splice(index,1);
                    }
                }
            }
        })
        return availableRooms;
    }
    catch(error){
        console.error("Following error occurred.", error);
        
    }
}

module.exports = roomsAvailable;