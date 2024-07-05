exports.successResponse = (res, msg) => {
  var data = {
    status: 200,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = (res, msg, data) => {
  var data = {
    status: 200,
    message: msg,
    data: data,
  };
  return res.status(200).json(data);
};

exports.successResponseWithDataAndCount = (res, count, data) => {
  var data = {
    status: 200,
    Totalcount: count,
    data: data,
  };
  return res.status(200).json(data);
};

exports.successResponseWithDataAndToken = (res, msg, data,token) => {
  var data = {
    status: 200,
    message: msg,
    data: data,
    token: token,
  };
  return res.status(200).json(data);
};

exports.catchedError = (res, msg) => {
  var data = {
    status: 500,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.errorResponse = (res, msg) => {
  var data = {
    status: 400,
    message: msg,
  };
  return res.status(400).json(data);
};

exports.notFound = (res, msg) => {
  var data = {
    status: 404,
    message: msg,
  };
  return res.status(404).json(data);
};

exports.unauthorized = (res, msg) => {
  var data = {
    status: 401,
    message: msg,
  };
  return res.status(401).json(data);
};


















