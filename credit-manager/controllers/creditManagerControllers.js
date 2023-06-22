const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/custom-errors");
const Credits = require("../models/Credits");
const kafka = require("../kafka/kafka-connect");
const readMessage = require("../kafka/kafka-subscriber");
const queueMessage = require("../kafka/kafka-publisher");
require("express-async-errors");

// kafka producer of new credit balance on specific user
const produce_topic = "credit-data";
const stream = kafka.producerCreate(produce_topic);

// kafka consumer of new users setup
const consume_topic = "user-data";
const groupd_id = "kafka2";
const consumer = kafka.consumerCreate(groupd_id, consume_topic);

// read messages from
const parseMsg = async (msg) => {
  const user = await Credits.findOne({ email: msg.email });
  if (!user) {
   return await Credits.create({ ...msg });
  }
  user.credits = msg.credits;
  await user.save();
};
readMessage(consumer, parseMsg);

/** Controllers
 * @description this endpoint is in charge of purchasing credits and updating the database
 * @param {JSON} req.body
 * @returns {JSON} {success: Boolean, result: Obj} Obj has email and new credit balance
 */
const purchase = async (req, res) => {
  const newUserData = await controllersController(req, res, (x, y) => {
    return x + y;
  });
  queueMessage(newUserData, stream);
};

/**
 * @description this endpoint is in charge of update user credit score after a purchase
 * @param {JSON} req.body {email: String, credits: Number}
 * @returns  {JSON} {success: Boolean, result: Obj} Obj has email and new credit balance
 */
const update = async (req, res) => {
  const newUserData = await controllersController(req, res, (x, y) => {
    return x - y;
  });
  queueMessage(newUserData, stream);
};

// sends response, returns object to publish with new credit balance
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
  if (user.credits < 0) {
    throw new BadRequest("Customer credit balance is insufficient");
  }
  await user.save();
  res.status(StatusCodes.OK).json({
    success: true,
    result: { email: user.email, newCredits: user.credits },
  });

  return { email: user.email, credits: user.credits };
}

module.exports = { purchase, update };
