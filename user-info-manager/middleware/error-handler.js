const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.status).json({msg: err.message});
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

module.exports = errorHandlerMiddleware;