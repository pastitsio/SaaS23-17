const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(status).json({ success: false, msg: err.message });
  next();
};

module.exports = errorHandlerMiddleware;
