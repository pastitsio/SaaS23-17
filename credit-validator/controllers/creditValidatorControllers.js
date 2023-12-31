const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/Errors");
const Credits = require("../models/Credits");
require("express-async-errors");

// kafka
const { consumerCreate } = require("../kafka/kafka-connect");
const readMessage = require("../kafka/kafka-subscriber");

function syncDB(topic, group, parseMessage) {
  const consumer = consumerCreate(group, topic);
  readMessage(consumer, parseMessage);
}

// credits update => update with credits diff from message
syncDB("credit-data", "kafka15", async (msg) => {
  const filter = { email: msg.email };
  const update = { $inc: { credits: msg.credits}}
  await Credits.findOneAndUpdate(filter, update);
});

// user creation => create entry with 0 credits.
syncDB("user-data", "kafka15", async (msg) => {
  await Credits.create({ ...msg });
});


/**
 * Controller
 * @description controller check if specific user has enough credits in his balance
 * @param {queryString} req.query = {email: String, price: Number}
 * @returns {JSON} {user: String, enoughCredits: Boolean}
 */
const validateCredit = async (req, res) => {
  const { email, price } = req.query;
  if (!email || !price) {
    throw new BadRequest(
      "Please insert parameters with the correct format: {email: String, price: Number} "
    );
  }

  const user = await Credits.findOne({ email });
  if (!user) {
    throw new NotFound("User not found");
  }

  if (user.credits > price || user.credits == price) {
    res
      .status(StatusCodes.OK)
      .json({ user: user.email, enoughCredits: true });
  } else {
    res.status(StatusCodes.PAYMENT_REQUIRED).json({ user: user.email, enoughCredits: false });
  }
};

module.exports = validateCredit;
