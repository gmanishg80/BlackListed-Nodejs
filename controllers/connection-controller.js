const { successMessage, errorMessage, validationMessage } = require("../helper/messages");
const { body } = require("express-validator");
const responses = require("../helper/responses");
const { handleValidationErrors } = require("../helper/validationHandler");
const POST = require("../models/post-schema")
const USER = require("../models/user-schema")
const CONNECTION = require("../models/connection-schema")
const { sendMail } = require("../helper/sendMail");
const jwt = require("jsonwebtoken");




exports.followUser = [
    async (req, res) => {

        try {
            const { to_user_id } = req.body;
            const from_user_id = req.user._id;

            const sendingUser = await USER.findById(from_user_id);
            if (!sendingUser) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const Receivinguser = await USER.findById(to_user_id);
            if (!Receivinguser) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
           


            const refData = {
                to_user_id: to_user_id,
                from_user_id: from_user_id,
                follow_status: true,
                connect_status: false,
                
            };

            console.log("refData", refData);
            const createConnection = await CONNECTION.create(refData);
            return responses.successResponseWithData(res, successMessage.CONNECTION_SENDED_SUCCESSFULLY, createConnection)

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.connectUser = [
    async (req, res) => {

        try {
            const { connectionId } = req.body;
            const from_user_id = req.user._id;


           

            const sendingUser = await USER.findById(from_user_id);
            if (!sendingUser) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
            console.log("email",sendingUser.email);

            const Checkconnection = await CONNECTION.findById(connectionId);
            if (!Checkconnection) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            console.log("ggggg",Checkconnection);
           


            const refData = {
                
                connect_status: false,
                
            };

            console.log("refData", refData);
            const createConnection = await CONNECTION.findOneAndUpdate({ _id: connectionId._id }, { $set: refData });



            // const token = jwt.sign({ id: createConnection1._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
            // console.log("token", token);

            // const verificationLink = `http://localhost:9000/connection/acceptConnectionRequestOnMail?token=${token}`;

            // const receiver = {
            //     from: "randomMail@gmail.com",
            //     to: sendingUser.email,
            //     subject: 'Connection Request',
            //     html: `<p>Click the following link to accept the request: <a href="${verificationLink}">Verify Email</a></p>`
            // };

            // console.log("receiver", receiver);

            // await sendMail(receiver);


            return responses.successResponse(res, successMessage.CONNECTION_SENDED_SUCCESSFULLY)

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.acceptConnectionRequestOnMail = [
    async (req, res) => {

        try {
            
            const { connectionId } = req.body;
            const to_user_id = req.user._id;

             console.log(connectionId);
             console.log(to_user_id);
           

            const receiveingUser = await USER.findById(to_user_id);
            if (!receiveingUser) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);
            console.log("email",receiveingUser.email);

            const Checkconnection = await CONNECTION.findById(connectionId);
            if (!Checkconnection) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            console.log("ggggg",Checkconnection);
    
    
            const refData = {
                connect_status: true,
            };
            const updatedConnection = await CONNECTION.findOneAndUpdate({ _id: Checkconnection._id }, { $set: refData });
    
            if (updatedConnection) {
                res.status(200).json({Message:"Updated"});
                // res.render('connection');
            } else {
                responses.errorResponse(res, errorMessage.CONNECTION_IS_NOT_ACCEPTED);
            }
        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
]


