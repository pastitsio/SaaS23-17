const { Producer } = require("../kafka");

const stream = Producer.createTopicStream("user-data");
const message = {
  email: "demos@testos.com",
  credits: 5,
};
Producer.produce(message,stream);
