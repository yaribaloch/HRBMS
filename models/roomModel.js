const { isNumber } = require("@hapi/joi/lib/common");
const mongoose = require("mongoose");





const roomSchema = new mongoose.Schema({
    roomCategory: {
        type: String,
    },
    roomNumber: {
        type: Number,
    },
    roomPrice: {
        type: Number,
    }
})




const Room = mongoose.model("Room", roomSchema);






module.exports={Room};