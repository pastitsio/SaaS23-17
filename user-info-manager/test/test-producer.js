const { Producer } = require("../kafka");
const { CreditsKafkaEvent } = require("../models");

const stream = Producer.createTopicStream("user-data");
const message = {
  email: "kokos@marokos.gr",
  credits: 0,
};
Producer.produce(message, CreditsKafkaEvent, stream);
