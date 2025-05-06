const express = require("express");
const http = require("http")
const {Server} = require("socket.io")
const {connectToMongoDb} = require("./connection");
const cookieParser = require("cookie-parser");
const path = require("path")
require('dotenv').config();
const userRouter = require("./routes/userRoute")
const roomRouter = require("./routes/roomRoute");
const bookingRouter = require("./routes/bookingRoute");
const homeRouter = require("./routes/homeRoute");
const loginRouter = require("./routes/loginRoute");
const signupRouter = require("./routes/signupRoute");
const stripeRouter = require("./routes/stripeRoute");
const commentRouter = require("./routes/commentRoute");
const {restrictToLoginedUserOnly} = require("./middlewares/auth")
const app = express();
app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
//socket connection
const server = http.createServer(app)
const io = new Server(server)
app.set("io", io);
io.on("connection", (socket)=>{
console.log("A new socket has connected ",socket.id);
})

//mongodb connection
connectToMongoDb();
//routers
app.use("/users", restrictToLoginedUserOnly, userRouter);
app.use("/rooms", restrictToLoginedUserOnly, roomRouter);
app.use("/bookings", restrictToLoginedUserOnly, bookingRouter);
app.use("/home", restrictToLoginedUserOnly, homeRouter);
app.use("/stripe", restrictToLoginedUserOnly,stripeRouter);
app.use("/comments",commentRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.get("/", (req,res)=>{
    res.sendFile("/public/index.html")
    
})
server.listen(3000, ()=>{
    console.log("server is live at port 3000.")
    })
