const express = require("express");
const {handleUserLogin, handleLogin} = require("../controllers/loginController");

const router = express.Router();

router.get("/", handleLogin);
router.post("/userlogin", handleUserLogin);
module.exports = router;