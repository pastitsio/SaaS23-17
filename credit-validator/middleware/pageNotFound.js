const { StatusCodes } = require("http-status-codes");

const pageNotFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("Page not found");
};

module.exports = pageNotFound;
