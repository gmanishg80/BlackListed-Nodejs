const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-middleware");
const userController = require("../controllers/user-controller");
const {userAuthMiddleware} = require("../middlewares/user-authentication");
const uploadMultiple = require("../utils/cloudinary");


router.post("/checkUserName",userController.checkUserName);
router.post("/createUser",userController.createUser);
router.get("/getUserProfile",userAuthMiddleware,userController.getUserProfile);
router.get("/getAllUser",userController.getAllUser);
router.get("/verifyEmail",userController.verifyEmail);
router.post("/loginUser",userController.loginUser);
router.post("/completeUserProfile",userAuthMiddleware,userController.completeUserProfile);
router.put("/changePassword",userAuthMiddleware,userController.changePassword);
router.put("/updateUserProfile",userAuthMiddleware,userController.updateUserProfile);
// router.post("/uploadMedia",userAuthMiddleware,upload.fields([{name: "profile_img", maxCount: 1,},]),userController.uploadMedia);
router.post("/uploadMedia",upload.array("images"),uploadMultiple,userController.uploadMedia);
router.post("/forgotPasswordWithOtp",userController.forgotPasswordWithOtp);
router.post("/verifyOtp",userController.verifyOtp);
router.put("/resetPassword",userController.resetPassword);
router.get("/termsAndCondition",userController.termsAndCondition);

module.exports=router; 