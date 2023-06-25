const { Consumer } = require("../kafka");
const { ChartsKafkaEvent } = require("../models");

const consumer = Consumer.create("kafka1", "chart-data");
const parseMessage = (msg) => {
    console.log(JSON.parse(msg));
}
Consumer.consume(consumer, ChartsKafkaEvent, parseMessage);
