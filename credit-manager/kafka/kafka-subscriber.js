const EventType = require("../models/EventType");

// reads message from stream
const readMessage = async (consumer, fn) => {
  await consumer.on("data", (data) => {
    console.log('read:', EventType.fromBuffer(data.value));
    fn(EventType.fromBuffer(data.value));
  });
};

module.exports = readMessage;
