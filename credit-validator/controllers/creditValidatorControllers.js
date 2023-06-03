const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/errors");
const Credits = require("../models/Credits");

require('express-async-errors')

/**
 *
 * @description controller check if specific user has enough credits in his balance
 * @param {queryString} req.query = {email: String, price: Number}
 * @returns {JSON} {user: String, enoughCredits: Boolean}
 */
const validateCredit = async (req, res) => {
  const { email, price } = req.query;
  if (!email || !price) {
    throw new BadRequest("Please insert parameters with the correct format: {email: String, price: Number} ");
  }

  const user = await Credits.findOne({ email });
  if (!user) {
    throw new NotFound("User not found");
  }

  if (user.credits > price || user.credits == price) {
    return res
      .status(StatusCodes.OK)
      .json({ user: user.email, enoughCredits: true });
  }
  res.status(StatusCodes.OK).json({ user: user.email, enoughCredits: false });
};

module.exports = validateCredit;
