const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/custom-erros");
const Credits = require("../models/Credits");
require("express-async-errors");

/**
 * @description this endpoint is in charge of purchasing credits and updating the database 
 * @param {JSON} req.body 
 * @returns {JSON} {success: Boolean, result: Obj} Obj has email and new credit balance
 */

const purchase = async (req, res) => {
  await controllersController(req, res, (x, y) => {
    return x + y;
  });
};

/**
 * @description this endpoint is in charge of update user credit score after a purchase
 * @param {JSON} req.body {email: String, credits: Number}
 * @returns {JSON} {success: Boolean, result: Obj} Obj has email and new credit balance
 */
const udpate = async (req, res) => {
  await controllersController(req, res, (x, y) => {
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
