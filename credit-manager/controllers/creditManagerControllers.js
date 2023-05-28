const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/custom-erros");
const Credits = require("../models/Credits");
require("express-async-errors");

/**
 *
 * @param {*} req
 * @param {*} res
 */

const purchase = (req, res) => {
  controllersController(req, res, (x, y) => {
    return x + y;
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const udpate = (req, res) => {
  controllersController(req, res, (x, y) => {
    return x - y;
  });
};

async function controllersController(req, res, fn) {
  const { email, credits } = req.body;
  if (!email || !credits) {
    throw new BadRequest(
      "Email and purchasedCreditAmount fields are mandatory"
    );
  }

  const user = await Credits.findOne({ email });
  if (!user) {
    throw new NotFound("User not found");
  }

  user.credits = fn(user.credits, credits);
  if(user.credits < 0) {
    throw new BadRequest('Customer credit balance is insufficient');
  }
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ success: true, result: { email: user.email, newCredits: user.credits } });
}

module.exports = { purchase, udpate };
