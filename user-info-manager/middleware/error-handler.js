const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    res.status(err.status).json({ success: false, msg: err.message });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, err });
  next();
};

module.exports = errorHandlerMiddleware;
