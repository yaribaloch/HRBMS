const express = require("express");
const bodyParser = require("body-parser")
const router = express.Router();
const {handleAddUser, 
    handleGetAllUsers, 
    handleFindUser, 
    handleChangeUserRole, 
    handleSignUp, 
    handleChangeUserEmail, 
    handleChangeUserPassword,
    handleDeleteUserAccount,
    handleAddBalance} = require("../controllers/userController");
const {restrictToRole} = require("../middlewares/auth")

router.post("/adduser",restrictToRole(["Admin", "Hotel Manager"]), handleAddUser)

router.get("/allusers",restrictToRole(["Admin", "Hotel Manager"]), handleGetAllUsers)
router.post("/finduser",restrictToRole(["Admin", "Hotel Manager"]), handleFindUser)
router.post("/changerole",restrictToRole(["Admin"]), handleChangeUserRole)
router.post("/changeemail",restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleChangeUserEmail)
router.post("/changepassword",restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleChangeUserPassword)
router.post("/deleteaccount", handleDeleteUserAccount)
router.post("/addbalance", restrictToRole(["Admin", "Hotel Manager"]), handleAddBalance)
//router.post("/signup", handleSignUp)

module.exports = router;