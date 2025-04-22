const express = require("express");
const {handleAddBooking,
     handleCancelBooking,
     handleSearchBookingSlot, 
     handleBookingHistory, 
     handleUpdateBooking,
     handleSearchBooking} = require("../controllers/bookingController")
const {restrictToRole} = require("../middlewares/auth")
const router = express.Router();
// Routes
router.get("/searchslot", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleSearchBookingSlot);
router.post("/addbooking", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleAddBooking);
router.post("/cancelbooking", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleCancelBooking);
router.get("/bookinghistory", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleBookingHistory);
router.post("/updatebooking", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleUpdateBooking);
router.post("/searchbooking", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleSearchBooking);
// router.get("/checkbooking");

module.exports = router;