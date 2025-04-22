const express = require("express");
const {handleUserSignup, handleSignup} = require("../controllers/signupController");

const router = express.Router();

router.get("/", handleSignup);
router.post("/handleUserSignup", handleUserSignup);
module.exports = router;