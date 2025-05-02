const express = require("express");
const {handleComment, handleShowComments} = require("../controllers/commentController");
const {restrictToRole} = require("../middlewares/auth")
const router = express.Router();

router.post("/addcomment", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleComment);
router.get("/showcomments", restrictToRole(["Admin", "Hotel Manager", "Customer"]), handleShowComments);
module.exports = router;