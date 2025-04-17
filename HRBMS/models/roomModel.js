const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomCategory: {
        type: String,
    },
    roomPrice: {
        type: Number,
    }
})

const Room = mongoose.model("Room", roomSchema);

module.exports={Room};