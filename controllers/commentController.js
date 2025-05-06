const logedinUser = require("../utilities/logedinuser")
const Booking = require("../models/bookingModel");
const {User} = require("../models/userModel")
const {Comment} = require("../models/commentModel");
const { $_match } = require("@hapi/joi/lib/base");
const {commentAuthSchema} = require("../utilities/validationSchema")
async function handleComment(req, res){
const result = await commentAuthSchema.validateAsync(req.body);

const bookings = await Booking.aggregate([{
    $lookup: {
    from: "users",
    localField: "userID",
    foreignField: "_id",
    as: "Users"}
},
{
  $unwind: "$Users"
},
{ $match:{
    "_id": req.userID
    }
},
{
    $project: {
        "Users": 1
    }
}
])

if(!bookings)
    return res.status(400).json({
    status: false,
    message: "Only users who have booked room can pass rating."
})
const comment = new Comment({
    message: result.message,
    rating: result.rating,
    userID: req.userID
})

const newComment = await comment.save()

return res.status(200).json({
    status: true,
    comment: newComment
})
}
async function handleShowComments(req, res) {
    const comments = await Comment.aggregate([{
        $lookup:{
            from:"users",
            localField: "userID",
            foreignField: "_id",
            as: "UserDetails"
        }
    },
    {
        $unwind: "$UserDetails"
    },
    {
        $project: {
            "_id": 0,
            "__v": 0,
            "message": 1,
            "rating": 1,
            "UserDetails.userName":1
            }
    }
]);
    return res.status(200).json({
        status: true,
        comments: comments
    })
}
module.exports = {handleComment, handleShowComments}