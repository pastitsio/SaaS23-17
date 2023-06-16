const { consumerCreate } = require("../kafka/kafka-connect");
const readMessage = require("../kafka/kafka-subscriber");

const consumer = consumerCreate("kafka12", "user-data");
const parseMessage = (msg) => {
    console.log(`email: ${msg.email}\ncredits: ${msg.credits}\n`);
}
readMessage(consumer, parseMessage);
