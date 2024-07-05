const JWT = require("jsonwebtoken");
const USER = require("../models/user-schema");
const { validationMessage, successMessage, errorMessage } = require("../helper/messages");
const response = require("../helper/responses");
require("dotenv").config();

exports.userAuthMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return response.notFound(res, errorMessage.USER_NOT_EXIST);
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return response.notFound(res, errorMessage.TOKEN_NOT_FOUND);
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.id;
    const user = await USER.findOne({ _id: userId });
    if (!user) return response.errorResponse(res, errorMessage.USER_NOT_EXIST)
    req.user = user;
    next();
  }
  catch (error) {
    return response.unauthorized(res, errorMessage.INVALID_USER);
  }
};
