const { response } = require("express");

const fetch = require('node-fetch');
const Booking = require("../models/bookingModel");
const {User} = require("../models/userModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const {bookingPrice} = require("../utilities/bookingPrice");
const roomsAvailable = require("../utilities/availableroom");
const logedinUser = require("../utilities/logedinuser");
const getroomproperties = require("../utilities/getroomproperties")
const makeATransaction = require("../utilities/makeATransaction")
const {bookingAuthSchema} = require("../utilities/validationSchema");
const handleCreateStripeSession = require("../utilities/handleCreateStripeSession")   

async function handleAddBooking(req, res) {
    try{
        const result =await bookingAuthSchema.validateAsync(req.body);
        //User That Is Currently LoggedIn
        const user =await logedinUser(req.userID);
        if(user) {
            //Request Data.
            const startDate = req.body.bookingStartDate;
            const endDate = req.body.bookingEndDate;
            const rqstdRoomNos  = req.body.roomNumbers;
            //Booking Price According To Days And Room Price
            const bPrice = await bookingPrice(startDate, endDate,rqstdRoomNos, res);
            //Constructing New Booking
            const newBooking = {
            // bookingId : bookingId,
            roomNumbers : rqstdRoomNos,
            userID : user._id,
            //roomCategory : room.roomCategory,
            bookingPrice : bPrice,
            bookingDate : new Date(),
            bookingStartDate : startDate,
            bookingEndDate : endDate,
            }
            const sessionData = handleCreateStripeSession(res, newBooking);
            return res.status(200).json({
            status: true,
            message: "Stripe payment session created.",
            sessionData: sessionData
        })
        }else{
            res.send("Requested user not found, please register user.")
        }
    }
    catch(error){
        console.error("Following error occurred.", error);
    }
}
async function handleCancelBooking(req, res) {
    const bookingId = req.body.bookingId;
    //Booking To Be Cancelled
    const currBooking = await Booking.findOne({_id: bookingId});
    if(!currBooking)
        return res.send("No such booking was found.")
    //Amount Paid For The Booking
    const paidAmount = currBooking.bookingPrice;
    //Refund Amount After 25% Cut.
    const refundAmount = (paidAmount*75)/100;
    const user = await logedinUser(req.userID);
    //If Customer LoggedIn Owns Booking Or Admin/Manager Is Logged In
    if((currBooking.userID==user._id)||(["Admin", "Hotel Manager"].includes(user.userRole))){ 
        //Add Refund Amount In Customers Account
        await User.updateOne({_id: currBooking.userID}, {$inc:{userBalance: refundAmount}});
        //Remove Booking 
        await Booking.deleteOne({_id: bookingId});
        return res.send("Booking canceled and 75% of bookig fee reimbursed.")
    }else{
        return res.send("No such booking was found.")
    }
}
async function handleUpdateBooking(req, res) {
    try{//Data From Request Body.
    const bookingId = req.body.bookingId;
    const givenRoomNo = req.body.roomNumber;
    //Booking To Be Updated.
    const currBooking = await Booking.findOne({_id: bookingId});
    const currRoomNo = currBooking.roomNumber;
    const newStartDate = req.body.bookingStartDate?req.body.bookingStartDate:currBooking.bookingStartDate;
    const newEndDate = req.body.bookingEndDate? req.body.bookingEndDate:currBooking.bookingEndDate;
    //User Who Booked Room.
    const user = await User.findOne({_id: currBooking.userID});
    // New Room, Replacing The Previous Room In Booking.
    const newRoomNo = givenRoomNo? givenRoomNo:currRoomNo;
    
    let newRoomPrice =await getroomproperties(newRoomNo, "roomPrice");
    const newRoomCategory = await getroomproperties(newRoomNo, "roomCategory");

    let newBookingPrice=null;
    //Difference In Booking's Price With Previous Room And New Room.
    let amountDiff=null;
    //Available Room No.s In New Date Range.
    const availables = await LookForBookingSlot(newStartDate, newEndDate, null, bookingId);        
    if(availables.includes(newRoomNo)){
        //Booking Price According To New Room Price.
        newBookingPrice = await bookingPrice(newStartDate, newEndDate, newRoomPrice, res);
        //Diff. Of Amount To Repay Or Recharge Remaining Amount.
        amountDiff = currBooking.bookingPrice-newBookingPrice;
        //Deduct Remaining Fee Or Add Refund To The Customer's Account.
        await makeATransaction(amountDiff, user, res);
        //Update Booking With New Data.
        await Booking.updateMany({_id: bookingId}, {$set:{roomNumber: newRoomNo, roomCategory: newRoomCategory, bookingPrice: newBookingPrice, bookingStartDate:newStartDate, bookingEndDate:newEndDate  }}); 
    }else{
        return res.send("Room not available!")
    }

    return res.json(await Booking.findOne({_id: bookingId}));
    }catch(error){
        console.log(error);
    }
}
async function LookForBookingSlot(newStartDate, newEndDate , category, bookingExcepId) {
    //For Updating A Booking, it must include the Days Reserved by Curr Booking.
    try{
        const startDate = Date.parse(new Date(newStartDate));
        const endDate = Date.parse(new Date(newEndDate ));
        //Booking ExceptionId Is For Booking Update. 
        //In Booking Update, Room Reserved In Current Booking Must Have Exception
        //Bcz May Be User Just Wanted To Update Booking Date For That Room Not Room
        //So It Must Apear In New Available Rooms
        availables = await roomsAvailable(startDate, endDate, category, bookingExcepId);
        return availables;
    }
    catch(error){
        console.error("Following error occurred.", error);
    }
}

async function handleSearchBookingSlot(req, res) {
    try{
        //Specifying Booking Time Period And Room Category
        const startDate = Date.parse(new Date(req.body.startDate));
        const endDate = Date.parse(new Date(req.body.endDate));
        const category = req.body.roomCategory;
        //Getting Available Rooms In Specified Date and Category
        availables = await roomsAvailable(startDate, endDate, category);
        res.send(availables);
    }
    catch(error){
        console.error("Following error occurred.", error);
    }
}
async function handleBookingHistory(req, res) {
    try{
        //Get LoggedIn User 
        const user =await logedinUser(req.userID);
        //Pagination
        let limit = req.query.limit || 3;
        let page = req.query.page || 1;
        let skip = (page-1)*limit;
        //Show Only User's Own Booking Record
        if(user){
            const bookingRecord = await Booking.aggregate([{$lookup:{
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "userDetails"
            }},
            {$unwind:"$userDetails"},
            {
                $match:{"userDetails._id":user._id}
            },
            {$project:{
                    "userDetails": 0
            }},
        ]).skip(skip).limit(100);
            res.send(bookingRecord)
        }
    }
    catch(error){
        console.error("Following error occurred.", error);
    }
}
async function handleSearchBooking(req, res) {
    try{
        const user =await logedinUser(req.userID);
        const bookingId = req.body.bookingId;
        const userID = req.body.userID;
        //Converting Date To Milliseconds
        const startDate = req.body.bookingStartDate?new Date(req.body.bookingStartDate) :new Date("2020-01-01");
        const endDate = req.body.bookingEndDate?new Date(req.body.bookingEndDate): new Date("2099-12-31");
        //Pagination
        let limit = req.query.limit || 3;
        let page = req.query.page || 1;
        let skip = (page-1)*limit;
        
        if(["Admin", "Hotel Manager"].includes(user.userRole)) {
            const query = {}
            //Searched Using Booking ID
            if(bookingId){
                query._id= bookingId;
            }
            //Searched Using User ID
            if(userID){      
                query.userID= userID;      
            }
            //Search Using Start And End Date Only
            if(startDate){
                query.bookingStartDate=  {$gte: startDate};  
            }
            if(endDate){
                query.bookingEndDate= {$lte: endDate};  
            }
            console.log(query);
            console.log(limit);
            const bookingRecord = await Booking.aggregate([{$lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "UserDetails"
            }},
            {
                $unwind: "$UserDetails"    
            },
            {$project:{
                "UserDetails._id": 0,
                "UserDetails.userPassword":0,
                "UserDetails.__v": 0
            }},
            {$limit: Number(limit)},
            {$skip: skip}]);
            if(!bookingRecord){
                return res.status(404).json({
                    status: false,
                    message: "Booking not found."
                })
            }
            res.send(bookingRecord);
        }
    }
    catch(error){
        console.error("Following error occurred.", error);
    }
}
async function handleBookingPaymentSuccess(req, res) {
    const sessionID = req.query.session_id;
    console.log("ID: "+sessionID);
    
    const session = await stripe.checkout.sessions.retrieve(sessionID)
    if(!session) return res.status(500).json({
        status: false,
        message: "Could not retrieve checkout session.",
    })

    const booking= JSON.parse(session.metadata.booking)
    const newBooking = new Booking(booking);
    const paymentStatus = session.payment_status
    if(!paymentStatus) return res.status(500).json({
        status: false,
        message: "Payment unsuccessful, booking not added.",
    })
    
    const savedBooking = await newBooking.save();
    res.status(300).json({
        status: true,
        message: "Payment successful, booking added.",
        booking: savedBooking
    })
}
async function handleBookingPaymentCancel(req, res) {
    res.status(400).json({
        status: false,
        message: "Payment failed, booking not added.",
    })
}
module.exports = {handleAddBooking,
     handleCancelBooking, 
     handleSearchBookingSlot, 
     handleBookingHistory,
     handleUpdateBooking,
     handleSearchBooking,
     handleBookingPaymentSuccess,
     handleBookingPaymentCancel}