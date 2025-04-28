const express = require("express");
const {connectToMongoDb} = require("./connection");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const userRouter = require("./routes/userRoute")
const roomRouter = require("./routes/roomRoute");
const bookingRouter = require("./routes/bookingRoute");
const homeRouter = require("./routes/homeRoute");
const loginRouter = require("./routes/loginRoute");
const signupRouter = require("./routes/signupRoute");
const stripeRouter = require("./routes/stripeRoute");
const {restrictToLoginedUserOnly} = require("./middlewares/auth")
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());

//connection
connectToMongoDb();

//routers
app.use("/users", restrictToLoginedUserOnly, userRouter);
app.use("/rooms", restrictToLoginedUserOnly, roomRouter);
app.use("/bookings", restrictToLoginedUserOnly, bookingRouter);
app.use("/home", restrictToLoginedUserOnly, homeRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/stripe", stripeRouter);




app.listen(3000, ()=>{
    console.log("server is live at port 3000.")
    })

// const bookingSchema = new mongoose.Schema({
//     bookingId: Number,
//     userID: Number,
//     R_id: Number,
//     roomCategory: String,
//     bookingPrice: Number,
//     bookingDate: Date,
//     bookingStartDate: Date,
//     bookingEndDate: Date,
// })

// const roomSchema = new mongoose.Schema({
//     R_id: Number,
//     roomCategory: String,
//     roomPrice: Number
// })

//app.post("")
















//app.use(bodyParser.urlencoded({extended: true}))





// app.get("/", (req, res)=>{
//     res.sendFile(__dirname + "/index.html");
// })

// app.get("/admin", (req, res)=>{
//     res.sendFile(__dirname + "/admin.html");
// })

// app.post("/admin", (req, res)=>{
//     var roomNumber = req.body.roomno;
//     var category = req.body.category;
// console.log(roomNumber + "   " + category);

// })

