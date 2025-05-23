const express = require("express");
const {
     handleBookingPaymentSuccess,
     handleBookingPaymentCancel} = require("../controllers/bookingController")
const router = express.Router();
// Routes
router.get("/bookingpaymentsuccess", handleBookingPaymentSuccess);
router.get("/bookingpaymentcancel", handleBookingPaymentCancel);

module.exports = router;