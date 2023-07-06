const EventType = require("../models/EventType");
const { CustomAPIError } = require("../errors/custom-errors");
const { StatusCodes } = require("http-status-codes");

// writes message to stream
const queueMessage = async (event, stream) => {
  const success = await stream.write(EventType.toBuffer(event));
  if (!success) {
    throw new CustomAPIError(
      `Error on sending event ${JSON.stringify(event)}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } else {
    console.log(`written: ${JSON.stringify(event)}`);
  }
};

module.exports = queueMessage;
