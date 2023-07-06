const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/custom-errors");
const Credits = require("../models/Credits");
const { producerCreate, consumerCreate } = require("../kafka/kafka-connect");
const readMessage = require("../kafka/kafka-subscriber");
const queueMessage = require("../kafka/kafka-publisher");
require("express-async-errors");

function syncDB(topic, group, parseMessage) {
  const consumer = consumerCreate(group, topic);
  readMessage(consumer, parseMessage);
}

// credits update => update with credits diff from message
syncDB("credit-data", "kafka2", async (msg) => {
  const filter = { email: msg.email };
  const update = { $inc: { credits: msg.credits } }
  await Credits.findOneAndUpdate(filter, update);
});

// user creation => create entry with 0 credits.
syncDB("user-data", "kafka2", async (msg) => {
  await Credits.create({ ...msg });
});

// kafka producer of new credit balance on specific user
const produce_topic = "credit-data";
const stream = producerCreate(produce_topic);

/** Controllers
 * @description this endpoint is in charge of purchasing credits and updating the database
 * @param {JSON} req.body
 * @returns {JSON} {success: Boolean, result: Obj} Obj has email and new credit balance
 */
const purchase = async (req, res) => {

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

  const event = { email: email, credits: credits };
  queueMessage(event, stream);
  
  res.status(StatusCodes.OK).json({
    success: true,
    result: { email: user.email, newCredits: user.credits + credits },
  });

};

module.exports = { purchase };
