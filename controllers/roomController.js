const Joi = require("joi");
const {Room}= require("../models/roomModel")
const {roomAuthSchema} = require("../utilities/validationSchema");
const { result } = require("@hapi/joi/lib/base");
const Booking = require("../models/bookingModel");
async function handleAddRoom(req, res){
    try{
        const result =await roomAuthSchema.validateAsync(req.body);
        const room = Room.find({roomNumber: result.roomNumber})
        if(room) return res.status(300).json({
            status: false,
            message: "This room is already added in list."
        })
        switch(result.roomCategory){
            case "Standard": roomPrice = 4000
            break;
            case "Delux": roomPrice = 6000
            break;
            case "Suite": roomPrice = 9000
            break;
        }
        const newRoom = new Room({
        roomNumber: result.roomNumber,
        roomCategory: result.roomCategory,
        roomPrice: roomPrice
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
        const deletedBooking = await Booking.find({roomNumber: req.body.roomNumber});
        const deletedIds = deletedBooking.map(b=>b.bookingId);
        await Booking.deleteMany({roomNumber: req.body.roomNumber});
        res.json(deletedIds);
        }else{
            res.status(400).json({
                status: false,
                message:"Room not found."
            })
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