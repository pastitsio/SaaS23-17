const { StatusCodes } = require("http-status-codes");

const pageNotFound = (req, res, next) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, msg: "Requested page not found" });
};

module.exports = pageNotFound;
