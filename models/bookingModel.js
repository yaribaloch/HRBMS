const mongoose = require("mongoose");






const bookingSchema = new mongoose.Schema({
    roomNumbers :[ {
        ref: "Room",
        type:mongoose.Schema.Types.ObjectId}],
    userID : {                                                                                             


        ref: "User",
        type:mongoose.Schema.Types.ObjectId
    },
    bookingPrice : {
        type:Number
    },
    bookingDate : {
        type:Date
    },
    bookingStartDate : {
        type:Date,
    },
    bookingEndDate : {
        type:Date,
    },




})

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;










