const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.status).json({ success: false, msg: err.message });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, err });
  next();
};

module.exports = errorHandler;
