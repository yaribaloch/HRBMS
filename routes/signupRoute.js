const express = require("express");
const {handleUserSignup, handleSignup, handleOTPverification} = require("../controllers/signupController");

const router = express.Router();

router.get("/", handleSignup);
router.post("/handleUserSignup", handleUserSignup);
router.post("/otpverification", handleOTPverification);
module.exports = router;