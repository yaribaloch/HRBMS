const {Room} = require("../models/roomModel");
async function getroomproperties(roomNo, propertyName) {
    const room = await Room.findOne({_id: roomNo});    
    return room[propertyName];
}
module.exports = getroomproperties;