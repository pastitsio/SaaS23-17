require("dotenv").config({ path: "../" });

const kafkaHost = `${process.env.KAFKA_HOST || "localhost"}`
const kafkaPort = `${process.env.KAFKA_PORT || 9092}`;

const brokersList = `${kafkaHost}:${kafkaPort}`;


module.exports = { brokersList };
