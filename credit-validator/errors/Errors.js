const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class BadRequest extends CustomAPIError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.BAD_REQUEST;
  }
}

class NotFound extends CustomAPIError {
  constructor(msg) {
    super(msg);
    this.status = StatusCodes.NOT_FOUND;
  }
}

class Unauthorized extends CustomAPIError {
    constructor(msg) {
        super(msg);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = { BadRequest, NotFound, Unauthorized };
