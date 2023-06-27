const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

class NotFound extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

class Unauthorized extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

module.exports = { BadRequest, NotFound, Unauthorized, CustomAPIError };
