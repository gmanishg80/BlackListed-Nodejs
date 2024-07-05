const { validationResult } = require('express-validator');
const responses = require("../helper/responses"); 

exports.handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responses.errorResponse(res, errors.array());
  }
  return null; 
};

