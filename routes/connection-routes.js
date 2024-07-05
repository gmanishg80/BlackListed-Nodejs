const express = require("express");
const router = express.Router();
const postController = require("../controllers/connection-controller");
const {userAuthMiddleware} = require("../middlewares/user-authentication");


router.post("/followUser",userAuthMiddleware,postController.followUser);
router.post("/connectUser",userAuthMiddleware,postController.connectUser);
router.put("/acceptConnectionRequestOnMail",userAuthMiddleware,postController.acceptConnectionRequestOnMail);




module.exports =router;