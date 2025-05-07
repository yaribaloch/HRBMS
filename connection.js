const mongoose = require("mongoose");

async function connectToMongoDb(){
 return mongoose.connect(process.env.MONGODB_CREDENTIALS);
};

module.exports = {connectToMongoDb};