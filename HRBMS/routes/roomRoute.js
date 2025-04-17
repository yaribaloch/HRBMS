const express = require("express");
const {handleAddRoom, handleRemoveRoom, handleAllRooms, handleChangePrice} = require("../controllers/roomController");
const {restrictToRole} = require("../middlewares/auth")

const router = express.Router();

router.post("/addroom", restrictToRole(["Admin", "Hotel Manager"]), handleAddRoom);
router.post("/removeroom", restrictToRole(["Admin", "Hotel Manager"]), handleRemoveRoom);
router.get("/allrooms", restrictToRole(["Admin", "Hotel Manager"]), handleAllRooms);
router.post("/changeprice", restrictToRole(["Admin", "Hotel Manager"]), handleChangePrice);

module.exports =router;