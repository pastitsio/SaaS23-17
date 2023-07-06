const Kafka = require("node-rdkafka");
const { StatusCodes } = require("http-status-codes");

const { brokersList } = require('./kafka-config');
const { CustomAPIError } = require("../errors");

// creates a consumer and returns it
const create = (group, topic) => {
  const consumer = new Kafka.KafkaConsumer({
    "group.id": group,
    "metadata.broker.list": brokersList,
  });

  consumer.connect();

  consumer
    .on("ready", () => {
      consumer.subscribe([topic]);
      consumer.consume();
      console.log(`<${topic}> consumer ready...`);
    })
    .on("error", () => {
      throw new CustomAPIError(
        `Kafka <${topic}> consumer bursted`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    });

  return consumer;
};

// reads message from stream
const consume = async (consumer, kafkaEventType, onConsumeCallback) => {
  await consumer.on("data", (data) => {
    console.log(`read:`, kafkaEventType.fromBuffer(data.value));
    onConsumeCallback(kafkaEventType.fromBuffer(data.value));
  });
};

module.exports = { create, consume };
