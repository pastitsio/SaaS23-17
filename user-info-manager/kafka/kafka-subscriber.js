require("dotenv").config();
const EventType = require("../models/EventType");

// reads message from stream
const readMessage = async (consumer, fn) => {
  await consumer.on("data", (data) => {
    fn(EventType.fromBuffer(data.value));
  });
};

module.exports = readMessage;
