const { Consumer } = require("../kafka");

const consumer = Consumer.create("kafka1", "user-data");
const parseMessage = (msg) => {
    console.log(`email: ${msg.email}\ncredits:${msg.credits}\n`);
}
Consumer.consume(consumer, parseMessage);
