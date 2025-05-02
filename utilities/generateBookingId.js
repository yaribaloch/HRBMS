// const Booking = require("../models/bookingModel")
// async function generateBookingId(rqstdRoomNo){

//     const lastBooking =await Booking.aggregate([{$lookup:{
//         from: "rooms",
//         localField: "roomNumber",
//         foreignField: "_id",
//         as: "room"
//     }},
//     {$match:{"room._id": rqstdRoomNo
//     }},
//     {
//         $unwind:"room"
//     },
//     {
//     $project:{
//         "_id":1,
//         "bookingId":1
//     }
//     }
//     ]).sort({_id:-1}).limit(1);

//     if(lastBooking==null || lastBooking==undefined)
//     {
//         return (rqstdRoomNo.toString()+"-A");  
//     }else{
//     const newBookingId = (rqstdRoomNo.toString() +"-"+ String.fromCharCode(lastBooking[0].bookingId.charCodeAt(0)+1))
//     return newBookingId;}
// }
// module.exports = generateBookingId;