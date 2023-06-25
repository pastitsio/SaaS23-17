const Kafka = require("node-rdkafka");
const { StatusCodes } = require("http-status-codes");

const { brokersList } = require('./kafka-config');
const { CustomAPIError } = require("../errors");

// creates a producer and returns stream object
const createTopicStream = (topic) => {
  const stream = Kafka.Producer.createWriteStream(
    {
      "client.id": "user-info-manager",
      "metadata.broker.list": brokersList,
      "dr_cb": true,
      "acks": 1
    },
    {},
    { topic }
  );

  // Handle error
  stream.on("error", (err) => {
    throw new CustomAPIError(
      "Something went wrong with the connection to Kafka",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  });

  console.log('Producer ready...');
  return stream;
};


// produces message to stream
const produce = async (event, kafkaEventType, stream) => {
  // validate with avro
  const validateEvent = kafkaEventType.isValid(event);
  if (!validateEvent) {
    throw new CustomAPIError(
      `Invalid event: ${JSON.stringify(event)}`,
      StatusCodes.BAD_REQUEST
    );
  }
  
  // write to stream
  const success = await stream.write(kafkaEventType.toBuffer(event));
  if (!success) {
    throw new CustomAPIError(
      `Error producing event ${JSON.stringify(event)}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  console.log(`Produced: ${JSON.stringify(event)}`);
};

module.exports = { createTopicStream, produce };
