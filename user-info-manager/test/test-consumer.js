const { Consumer } = require("../kafka");

const consumer = Consumer.create("kafka1", "chart-data");
const parseMessage = (msg) => {
    console.log(JSON.parse(msg));
}
Consumer.consume(consumer, parseMessage);
