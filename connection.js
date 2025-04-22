const mongoose = require("mongoose");

async function connectToMongoDb(){
 return mongoose.connect("mongodb+srv://myarikhan555:mmC2zJXNpMbqDgmp@cluster0.hnecl.mongodb.net/HotelReservationDB");
};

module.exports = {connectToMongoDb};