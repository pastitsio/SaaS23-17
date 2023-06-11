const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/");

const authUser = (req, res, next) => {
  const email = req.query.email;
  if (!email) {
    throw new CustomAPIError(
      "Field email is mandatory in request",
      StatusCodes.BAD_REQUEST
    );
  }

  if (!(email === req.kauth.grant.access_token.content.email)) {
    throw new CustomAPIError("Access denied", StatusCodes.FORBIDDEN);
  }
  next();
};

module.exports = authUser;