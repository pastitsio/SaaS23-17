const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/CustomAPIError');

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        res.status(err.status).json({success: false, msg: err.msg || 'hi'});
        next();
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({succes: false, err});
};

module.exports = errorHandler;