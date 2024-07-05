const USER = require("../models/user-schema");
const userAuthMiddleware = require("../middlewares/user-authentication");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const responses = require("../helper/responses");
const { validationMessage, successMessage, errorMessage } = require("../helper/messages");
const { handleValidationErrors } = require("../helper/validationHandler");
const { uploadFile } = require("../utils/cloudinary");
const nodemailer = require("nodemailer");
const { sendMail } = require("../helper/sendMail");
const sendVerificationLink = require("../helper/sendMail");
const { generateRandomNumber } = require("../utils/generateNumber");



exports.checkUserName = [
    body("user_name").trim().exists().notEmpty().withMessage(validationMessage.USER_NAME_IS_REQUIRED),
    async (req, res) => {
        try {
            const validationError = handleValidationErrors(req, res);
            if (validationError) return validationError;

            const { user_name } = req.body;
            const checkUserName = await USER.findOne({ user_name: user_name });
            if (checkUserName) {
                return responses.errorResponse(res, errorMessage.USER_ALREADY_EXIST);
            } else {
                return responses.successResponse(res, successMessage.USER_NAME_IS_AVAILABLE);
            }
        }
        catch (error) {
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    },
];


exports.createUser = [
    body("user_name").trim().exists().notEmpty().withMessage(validationMessage.USER_NAME_IS_REQUIRED),
    body("full_name").trim().exists().notEmpty().withMessage(validationMessage.FULL_NAME_IS_REQUIRED),
    body("email").trim().notEmpty().exists().withMessage(validationMessage.EMAIL_IS_REQUIRED).isEmail().withMessage(validationMessage.ENTER_A_VALID_EMAIL),
    body("password").notEmpty().exists().withMessage(validationMessage.PASSWORD_IS_REQUIRED).trim().isLength({ min: 8 }).withMessage(validationMessage.PASSWORD_MUST_CONTAIN_AT_LEAST_8_CHARACTERS),

    async (req, res) => {
        try {
            const validationError = handleValidationErrors(req, res);
            if (validationError) return validationError;

            const { user_name, full_name, email, password } = req.body;
            console.log(req.body);

            const checkExistingUser = await USER.findOne({ $or: [{ email: email }, { user_name: user_name }] });
            if (checkExistingUser) {
                if (email) return responses.errorResponse(res, errorMessage.EMAIL_ALREADY_EXIST);
                if (user_name) return responses.errorResponse(res, errorMessage.USER_NAME_ALREADY_EXIST);
            }
            console.log(checkExistingUser);

            const refData = {
                user_name: user_name,
                full_name: full_name,
                email: email,
                password: await bcrypt.hash(password, 10),
                email_verified: false
            };
            console.log("data", refData);

            const createUser = await USER.create(refData);
            console.log("user created");
            const token = jwt.sign({ id: createUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
            console.log("token", token);

            // const verificationLink = `http://192.168.1.54:9000/user/verifyEmail?token=${token}`;
            const verificationLink = `http://localhost:9000/user/verifyEmail?token=${token}`;

            const receiver = {
                from: "randomMail@gmail.com",
                to: email,
                subject: 'Verify your email',
                html: `<p>Click the following link to verify your email: <a href="${verificationLink}">Verify Email</a></p>`
            };

            console.log("receiver", receiver);

            await sendMail(receiver);

            // await sendVerificationLink(email, full_name, token);        //Send In Blue Code

            return responses.successResponseWithDataAndToken(res, successMessage.ACCOUNT_CREATED_SUCCESSFULLY, createUser, token);
        }
        catch (error) {
            console.log(error);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    },
];


exports.getUserProfile = async (req, res) => {
    try {

        const userId = req.query.userId;

        console.log(userId, "hhhhh");
        const user = await USER.findOne({ _id: userId });
        if (!user) {
            return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

        }
        return responses.successResponseWithData(res, successMessage.USER_DETAILS_FOUND_SUCCESSFULLY, user);

    }
    catch (error) {
        console.log(error);
        responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
    }
};


exports.getAllUser = async (req, res) => {

    try {
        //using Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        results.users = await USER.find().limit(limit).skip(startIndex).exec();
        if (!results) {
            return responses.errorResponse(res, errorMessage.USERS_NOT_FOUND);

        }
        return responses.successResponseWithDataAndCount(res, results.users.length, results);

    }
    catch (error) {
        console.log(error);
        responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
    }
};



exports.verifyEmail = async (req, res) => {

    try {
        const token = req.query.token;
        console.log("token", token);
        if (!token) return responses.errorResponse(res, errorMessage.INVALID_TOKEN);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const user = await USER.findById(userId);
        if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_FOUND);


        const refData = {
            email_verified: true
        };
        const updatedUser = await USER.findOneAndUpdate({ _id: user._id }, { $set: refData });

        if (updatedUser) {
            res.render('verificationPage');
        } else {
            responses.errorResponse(res, errorMessage.YOUR_EMAIL_IS_NOT_VERIFIED);
        }
    } catch (error) {
        console.log(error.message);
        responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
    }
};


exports.loginUser = [
    body("email").notEmpty().exists().withMessage(validationMessage.EMAIL_IS_REQUIRED).isEmail().withMessage(validationMessage.ENTER_A_VALID_EMAIL),
    body("password").notEmpty().exists().withMessage(validationMessage.PASSWORD_IS_REQUIRED),

    async (req, res) => {
        try {
            const validationError = handleValidationErrors(req, res);
            if (validationError) return validationError;

            const { email, password } = req.body;

            const user = await USER.findOne({ email: email });
            const isMatch = await bcrypt.compare(password, user.password);

            if (user.email_verified == false)
                return responses.errorResponse(res, errorMessage.YOUR_EMAIL_IS_NOT_VERIFIED);
            if (!user || !isMatch)
                return responses.unauthorized(res, errorMessage.INVALID_EMAIL_OR_PASSWORD);

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d", });

            responses.successResponseWithDataAndToken(res, successMessage.LOGIN_SUCCESSFULLY, user, token);
        }
        catch (error) {
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    },
];


exports.changePassword = [
    body("oldPassword").trim().notEmpty().exists().withMessage(validationMessage.OLD_PASSWORD_IS_REQUIRED),
    body("newPassword").trim().notEmpty().exists().withMessage(validationMessage.NEW_PASSWORD_IS_REQUIRED).isLength({ min: 8 }),
    // body("confirmPassword").trim().notEmpty().exists().withMessage(validationMessage.NEW_PASSWORD_IS_REQUIRED),

    async (req, res) => {
        try {
            const validationError = handleValidationErrors(req, res);
            if (validationError) responses.errorResponse(res, validationError);

            const { oldPassword, newPassword } = req.body;
            const userId = req.user._id;
            const user = await USER.findById(userId);
            const password = user.password;
            const isMatch = await bcrypt.compare(oldPassword, password);
            if (!isMatch) return responses.errorResponse(res, errorMessage.PASSWORD_DONOT_MATCH);

            // if (newPassword !== confirmPassword) responses.errorResponse(res, errorMessage.NEW_PASSWORD_AND_CONFIRM_PASSWORD_DONOT_MATCHED);

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updated = await USER.findOneAndUpdate({ _id: user._id }, { $set: { password: hashedPassword } });

            return responses.successResponse(res, successMessage.PASSWORD_CHANGED_SUCCESSFULLY)


        } catch (error) {
            console.error(error);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.completeUserProfile = [
    async (req, res) => {
        try {
            const userKeysArray = ['state', 'city', 'industry', 'job_title', 'sub_industry', 'business_owner', 'looking_for', 'profile_img'];
            const refObj = {};

            // const profile_img = req.images;
            // console.log(profile_img);

            for (const key of userKeysArray) {
                if (req.body[key] != null) {
                    refObj[key] = req.body[key];
                }
            }

            // Evaluate profile status based on all conditions
            if (refObj.profile_img) {
                refObj.profile_status = 5;
            } else if (refObj.looking_for) {
                refObj.profile_status = 4;
            } else if (refObj.sub_industry) {
                refObj.profile_status = 3;
            } else if (refObj.industry) {
                refObj.profile_status = 2;
            } else if (refObj.state || refObj.city) {
                refObj.profile_status = 1;
            }

            const userId = req.user._id;

            const userData = await USER.findOneAndUpdate({ _id: userId }, { $set: refObj }, { new: true });
            console.log(userData, "---------aaaaaa");

            if (!userData) {
                return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
            }
            return responses.successResponseWithData(res, successMessage.USER_PROFILE_UPDATED, userData);
        } catch (err) {
            console.log("error", err.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.updateUserProfile = [
    body("userName").trim().exists().notEmpty().withMessage(validationMessage.USER_NAME_IS_REQUIRED),
    body("fullName").trim().exists().notEmpty().withMessage(validationMessage.FULL_NAME_IS_REQUIRED),
    body("email").trim().notEmpty().exists().withMessage(validationMessage.EMAIL_IS_REQUIRED).isEmail().withMessage(validationMessage.ENTER_A_VALID_EMAIL),
    body("industry").trim().exists().notEmpty().withMessage(validationMessage.PLEASE_SELECT_INDUSTRY),
    body("lookingFor").trim().exists().notEmpty().withMessage(validationMessage.SELECT_FIELD),
    body("state").trim().exists().notEmpty().withMessage(validationMessage.PLEASE_SELECT_YOUR_STATE),
    body("city").trim().exists().notEmpty().withMessage(validationMessage.PLEASE_SELECT_YOUR_CITY),
    body("jobTitle").trim().exists().notEmpty().withMessage(validationMessage.SELECT_FIELD),

    async (req, res) => {

        const validationError = handleValidationErrors(req, res);
        if (validationError) responses.errorResponse(res, validationError);

        try {

            const { userName, fullName, email, industry, jobTitle, state, city, lookingFor } = req.body;

            const userId = req.user._id;
            console.log("userId :=", userId);
            const user = await USER.findById(userId);
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const updatedUserData = req.body;


            const completeUser = await USER.findByIdAndUpdate(userId, updatedUserData, { new: true });
            if (!completeUser) return responses.errorResponse(res, errorMessage.INVALID_USER)

            console.log("User data updated successfully");
            return responses.successResponseWithData(res, successMessage.USER_UPDATED_SUCCESSFULLY, completeUser)


        } catch (error) {
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


// exports.uploadMedia = [
//     async (req, res) => {
//         try {
//             // const { profile_img } = req.body;
//             const userId = req.user._id;
//             const user = await USER.findById(userId);
//             if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
//             console.log(user);

//             const profileLocalPath = req.files?.profile_img?.[0]?.path;

//             if (!profileLocalPath) {
//                 return responses.errorResponse(res, errorMessage.PROFILE_PHOTO_IS_REQUIRED);
//             }

//             const uploadImage = await uploadFile(profileLocalPath);
//             if (!uploadImage) {
//                 return responses.errorResponse(res, errorMessage.PROFILE_FILE_UPLOAD_FAILED);
//             }

//             const refData = {
//                 profile_img: uploadImage.url,
//             };
//             const profileImg = await USER.findByIdAndUpdate(userId, refData, { new: true });

//             return responses.successResponseWithData(res, successMessage.MEDIA_UPLOADED_SUCCESSFULLY, profileImg);

//         } catch (error) {
//             console.log(error.message);
//             responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);

//         }
//     }
// ];


// exports.forgotPasswordWithOtp = [

//     body("email").notEmpty().exists().withMessage(validationMessage.EMAIL_IS_REQUIRED).isEmail().withMessage(validationMessage.ENTER_A_VALID_EMAIL),

//     async (req, res) => {

//         const validationError = handleValidationErrors(req, res);
//         if (validationError) return validationError;

//         let testAccount = await nodemailer.createTestAccount();

//         try {
//             const { email } = req.body;
//             const user = await USER.findOne({ email: email });
//             if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);


//             var transport = nodemailer.createTransport({
//                 host: "sandbox.smtp.mailtrap.io",
//                 port: 2525,
//                 auth: {
//                     user: process.env.MY_GMAIL,
//                     pass: process.env.MY_PASSWORD,
//                 }
//             });


//             const getOTP = await generateRandomNumber();

//             const receiver = {
//                 from: "randomMail@gmail.com",
//                 to: email,
//                 subject: "Password Reset Request",
//                 text: "Hello " + user.full_name + " OTP: " + getOTP+ ""                

//             };

//             const refData = {
//                 email_otp: getOTP
//             };
//             console.log("hhhhh", refData);

//             const saveOtp = await USER.findByIdAndUpdate({ _id: user._id }, { $set: refData }, { new: true });

//             console.log("resetLink := ", receiver);

//             await transport.sendMail(receiver);

//             return responses.successResponse(res, successMessage.OTP_SENDED_SUCCESSFULLY)

//         } catch (error) {
//             responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
//         }
// }];


exports.forgotPasswordWithOtp = [
    body("email").notEmpty().exists().withMessage(validationMessage.EMAIL_IS_REQUIRED).isEmail().withMessage(validationMessage.ENTER_A_VALID_EMAIL),

    async (req, res) => {
        const validationError = handleValidationErrors(req, res);
        if (validationError) return validationError;

        try {
            const { email } = req.body;
            const user = await USER.findOne({ email: email });
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const getOTP = await generateRandomNumber();

            const receiver = {
                from: "randomMail@gmail.com",
                to: email,
                subject: "Password Reset Request",
                html: `<p>Hello ${user.full_name},</p>
                      <p>OTP: <strong>${getOTP}</strong></p>`
            };

            const refData = {
                email_otp: getOTP
            };

            await USER.findByIdAndUpdate(user._id, { $set: refData }, { new: true });

            await sendMail(receiver);

            return responses.successResponse(res, successMessage.OTP_SENDED_SUCCESSFULLY);
        } catch (error) {
            console.error("Error:", error.message);
            return responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.verifyOtp = [
    async (req, res) => {
        try {
            const { otp, email } = req.body;
            const user = await USER.findOne({ email: email });
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);


            console.log("user otp", user.email_otp);

            if (otp !== user.email_otp) {
                return errorResponse(res, errorMessage.OTP_DO_NOT_MATCHED);
            } else {
                return responses.successResponse(res, successMessage.OTP_MATCHED);
            }

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
]


exports.resetPassword = [
    body("newPassword").trim().notEmpty().exists().withMessage(validationMessage.NEW_PASSWORD_IS_REQUIRED),

    async (req, res) => {
        try {

            const validationError = handleValidationErrors(req, res);
            if (validationError) return validationError;

            const { newPassword } = req.body;
            const email = req.body.email.toLowerCase();
            const user = await USER.findOne({ email: email });
            if (!user) {
                return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await USER.findOneAndUpdate({ _id: user._id }, { $set: { password: hashedPassword } });
            responses.successResponse(res, successMessage.PASSWORD_CHANGED_SUCCESSFULLY)

        } catch (error) {
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];



exports.completeProfile = async (req, res) => {
    try {
        const userKeysArray = ['state', 'city', 'category', 'job_title', 'sub_category', 'user_type', 'user_interest', 'profile_image'];
        const refObj = {};
        for (const key of userKeysArray) {
            if (req.body[key] != null) {
                if (key === 'profile_image') {
                    if (typeof req.body[key] == 'object') {
                        refObj[key] = req.body[key]
                    }
                    else {
                        return helper.errorResponse(res, errorMessage.THIS_FIELD_REQUIRED_IN_KEY_VALUE_PAIR)
                    }
                }
                else {
                    refObj[key] = req.body[key]
                }
            }
        }
        // change the profile status after every step 
        if (refObj.state) {
            refObj.profile_status = 1;
        }
        else if (refObj.category) {
            refObj.profile_status = 2;
        }
        else if (refObj.job_title) {
            refObj.profile_status = 3;
        }
        else if (refObj.sub_category) {
            refObj.profile_status = 4;
        }
        else if (refObj.user_interest) {
            refObj.profile_status = 5;
        }

        const userData = await USER.findOneAndUpdate({ _id: req.currentUser._id }, { $set: refObj }, { new: true });
        if (userData.profile_status === 5) {
            const connectionRefData = {
                from_user_id: userData._id,
                to_user_id: constant.MASTERACCOUNTID,
                from_follow_status: true
            };
            const findConnection = await CONNECTION.findOne({ from_user_id: userData._id, to_user_id: constant.MASTERACCOUNTID })
            if (!findConnection) {
                await CONNECTION.create(connectionRefData);
            }
        };
        return helper.successResponseWithData(res, successMessage.USER_PROFILE_UPDATED, userData);
    }
    catch (err) {
        return helper.catchedErrorResponse(res, errorMessage.INTERNAL_SERVER_ERROR);
    }
};



exports.uploadMedia = [
    async (req, res) => {
        try {
            const imagePath = req.images;
            console.log("imagePath", imagePath);
            if (!imagePath || imagePath.length === 0) {
                return responses.errorResponse(res, errorMessage.NO_FILES_FOUND_TO_UPLOAD)
            }
            return responses.successResponseWithData(res, successMessage.MEDIA_UPLOADED_SUCCESSFULLY, imagePath);
        } catch (error) {

            console.log(error.message);
            return helper.catchedErrorResponse(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];



exports.termsAndCondition = (req, res) => {
    res.render('termsAndCondition', {
        title: 'Terms and Conditions'
    });
};







