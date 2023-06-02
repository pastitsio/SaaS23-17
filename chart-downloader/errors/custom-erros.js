const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
  constructor(msg) {
    super(msg);
  }
}

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