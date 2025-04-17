const Joi = require("joi");
const {Room}= require("../models/roomModel")
const {roomAuthSchema} = require("../utilities/validationSchema");
const { result } = require("@hapi/joi/lib/base");
const Booking = require("../models/bookingModel");
async function handleAddRoom(req, res){
    try{
        const result =await roomAuthSchema.validateAsync(req.body);
        
        console.log(result);
        
        const newRoom = new Room({
        _id: result._id,
        roomCategory: result.roomCategory,
        roomPrice: result.roomPrice,
        //r_availability: req.body.r_availability
        })
        const data = await newRoom.save();
        res.json(data);
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}

async function handleRemoveRoom(req, res){
    try{
        
        const roomDeleted = await Room.findOneAndDelete({_id: req.body.roomNumber})
        if(roomDeleted){
            // const newList = await Room.find({});
        const deletedBooking = await Booking.find({roomNumber: req.body.roomNumber});
        const deletedIds = deletedBooking.map(b=>b.bookingId);
        await Booking.deleteMany({roomNumber: req.body.roomNumber});

        res.json(deletedIds);
        }else{
            res.send("Room not found.");
        }
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}
async function handleAllRooms(req, res){
    try{
        let limit = req.query.limit || 3;
        let page = req.query.page || 1;
        let skip = (page-1)*limit;

        const rooms = await Room.find({}).skip(skip).limit(limit);
        res.send(rooms);
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}
async function handleChangePrice(req, res){
    try{
        const price = req.body.roomPrice
        const category = req.body.roomCategory
        await Room.updateMany({roomCategory:category}, {$set:{roomPrice:price}})
        res.send("Rooms price updated.");
    }
    catch(error){
        console.error("Error is: ",error);   
    }
}

module.exports = {
    handleAddRoom,handleRemoveRoom,handleAllRooms, handleChangePrice
}