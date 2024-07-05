const { successMessage, errorMessage, validationMessage } = require("../helper/messages");
const { body } = require("express-validator");
const responses = require("../helper/responses");
const { handleValidationErrors } = require("../helper/validationHandler");
const POST = require("../models/post-schema")
const USER = require("../models/user-schema")

exports.createPost = [
    async (req, res) => {

        try {
            const { post_text, media } = req.body;
            const userId = req.user._id;

            const user = await USER.findById(userId);
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const refData = {
                user_id: userId,
                post_text: post_text,
                media: media
            };

            console.log("refData", refData);
            const createPost = await POST.create(refData);
            return responses.successResponseWithData(res, successMessage.POST_CREATED_SUCCESSFULLY, createPost)

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.getPost = [
    async (req, res) => {
        try {

            const userId = req.user._id;
            const user = await USER.findById(userId);
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const userPosts = await POST.find({ user_id: userId });
            console.log(userPosts)

            return responses.successResponseWithData(res, successMessage.SUCCESS, userPosts)

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.editPost = [
    body("postId").trim().exists().notEmpty().withMessage(validationMessage.POST_ID_IS_REQUIRED),
    async (req, res) => {
        try {

            const validationError = handleValidationErrors(req, res);
            if (validationError) return validationError;

            const { post_text, postId, media } = req.body;
            const userId = req.user._id;
            const user = await USER.findById(userId);
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const findPost = await POST.findOne({ _id: postId });
            console.log("findPost", findPost);
            if (!findPost) {
                return responses.errorResponse(res, errorMessage.POST_NOT_FOUND);
            }

            // const postKeys = ['post_text', 'media'];
            // const refObj = {};
            // for (const key of postKeys) {
            //     if (req.body[key] != null) {
            //         refObj[key] = req.body[key];
            //     }
            // }

            // const postKeys = ['post_text', 'media'];
            // const refObj = {};
            // for (const key of postKeys) {
            //     if (req.body[key] != null) {
            //         refObj[key] = req.body[key];
            //     }
            //     if(key=="media"){
            //        refObj[key] = media && media.length > 0 ? media : [ ] ;
            //     }
                // req.body[key] != null ? refObj[key] = req.body[key] : null;
            // }

            console.log(refObj);


            const refData = {
                post_text: post_text,
            };

            console.log("refData", refData);

            const updatePost = await POST.findByIdAndUpdate(postId, refData, { new: true });
            console.log("Post updated successfully");
            return responses.successResponse(res, successMessage.POST_UPDATED_SUCCESSFULLY);

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.deletePost = [

    async (req, res) => {
        try {

            const userId = req.user._id;
            console.log("userId", userId);
            const user = await USER.findById(userId);
            if (!user) return responses.errorResponse(res, errorMessage.USER_NOT_EXIST);

            const postId = req.params.postId;
            console.log("postId", postId);

            const findPost = await POST.findOne({ _id: postId });
            console.log("findPost", findPost);
            if (!findPost) {
                return responses.errorResponse(res, errorMessage.POST_NOT_FOUND);
            }

            const deletePost = await POST.findByIdAndDelete(postId);
            console.log("Post deleted successfully");
            return responses.successResponse(res, successMessage.POST_DELETED_SUCCESSFULLY);

        } catch (error) {
            console.log(error.message);
            responses.catchedError(res, errorMessage.INTERNAL_SERVER_ERROR);
        }
    }
];


exports.postLikes = [
    async (req, res) => {
        try {

        } catch (error) {

        }
    }
];

















