const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-middleware");
const postController = require("../controllers/post-controller");
const {userAuthMiddleware} = require("../middlewares/user-authentication");


router.post("/createPost",userAuthMiddleware,postController.createPost);
router.get("/getPost",userAuthMiddleware,postController.getPost);
router.put("/editPost",userAuthMiddleware,postController.editPost);
router.delete("/deletePost",userAuthMiddleware,postController.deletePost);



module.exports =router;