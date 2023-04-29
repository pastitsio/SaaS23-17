const { consumerCreate } = require("../kafka/kafka-connect");
const readMessage = require("../kafka/kafka-subscriber");

const consumer = consumerCreate("kafka1", "user-data");
const parseMessage = (msg) => {
    console.log(`email: ${msg.email}\nlast_login:${msg.last_login}\n`);
}
readMessage(consumer, parseMessage);
