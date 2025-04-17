const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    // bookingId: {
    //     type: String
    // },
    roomNumbers :[ {
        ref: "Room",
        type:mongoose.Schema.Types.ObjectId}],
    userID : {
        ref: "User",
        type:mongoose.Schema.Types.ObjectId
    },
    // roomCategory : {
    //     type:String
    // },
    bookingPrice : {
        type:Number
    },
    bookingDate : {
        type:Date
    },
    bookingStartDate : {
        type:Date,
        required:[true, "Start date is must."]
    },
    bookingEndDate : {
        type:Date,
        required:[true, "End date is must."]
    },
})

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;