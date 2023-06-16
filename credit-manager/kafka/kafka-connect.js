const Kafka = require("node-rdkafka");
const CustomAPIError = require("../../user-info-manager/errors/custom-error");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config({ path: "../" });

// creates a producer and returns stram object
const producerCreate = (topic) => {
  const stream = Kafka.Producer.createWriteStream(
    {
      "client.id": "kafka1",
      "metadata.broker.list": `${process.env.HOST || "localhost"}:${
        process.env.KAFKA_PORT || 9092
      }`,
    },
    {},
    { topic }
  );

  stream.on("error", (err) => {
    throw new CustomAPIError(
      "Something went wrong with the connection to Kafka",
      err.status
    );
  });

  console.log('Producer ready...');
  return stream;
};

// creates a consumer and returns it
const consumerCreate = (group, topic) => {
  const consumer = new Kafka.KafkaConsumer({
    "group.id": group,
    "metadata.broker.list": `${process.env.HOST || "localhost"}:${
      process.env.KAFKA_PORT || 9092
    }`,
  });

  consumer.connect();

  consumer
    .on("ready", () => {
      consumer.subscribe([topic]);
      consumer.consume();
      console.log("Consumer ready...");
    })
    .on("error", (err) => {
      throw new CustomAPIError(
        `Kafka consummer bursted`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    });

  return consumer;
};

module.exports = { producerCreate, consumerCreate };
