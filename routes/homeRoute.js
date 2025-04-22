const express = require("express");
const handleHome= require("../controllers/homeController");
const {restrictToRole} = require("../middlewares/auth")
const router = express.Router();

router.get("/", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleHome);
module.exports = router;