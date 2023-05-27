const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../../user-info-manager/errors/custom-error");

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.status).json({success: false, msg: err.msg});
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, err});
    next();
};

module.exports = errorHandler;