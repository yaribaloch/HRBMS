const { type } = require("@hapi/joi/lib/extend")
const { required, ref } = require("joi")
const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    rating:{
        type: Number,
        default: 5
    },
    userID:{
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    }
})

const Comment = mongoose.model("Comment", commentSchema)
module.exports = {Comment}