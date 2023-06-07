const Kafka = require("node-rdkafka");
const { StatusCodes } = require("http-status-codes");

const { CustomAPIError } = require("../errors");

require("dotenv").config({ path: "../" });


const kafkaHost = `${process.env.HOST || "localhost"}`
const kafkaPort = `${process.env.KAFKA_PORT || 9092}`;

const brokersList = `${kafkaHost}:${kafkaPort}`;


module.exports = { brokersList };
