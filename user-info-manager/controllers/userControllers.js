const { User, KafkaEvent } = require("../models");
const { CustomAPIError } = require("../errors/");
const { StatusCodes } = require("http-status-codes");
const { Producer, Consumer } = require("../kafka/");
require("express-async-errors");

// connect to kafka as a publisher
const stream = Producer.createTopicStream("user-data");

// read new user credits
const creditConsumer = Consumer.create("kafka12", "credit-data");
const syncCreditsDB = async (msg) => {
  const filter = { email: msg.email };
  const update = { credits: msg.credits };
  await User.findOneAndUpdate(filter, update); // add argument `{ new: true }` to return updated entry.
};
Consumer.consume(creditConsumer, syncCreditsDB);

// update number of charts in user
const chratsConsumer = Consumer.create("kafka12", "chart-data");
const syncUsersDB = async (msg) => {
  const filter = { email: msg.email };
  const update = { $inc: {number_of_charts: 1} };
  await User.findOneAndUpdate(filter, update); // add argument `{ new: true }` to return updated entry.
};
Consumer.consume(chratsConsumer, syncUsersDB);

/**
 * @description gets user data from database and checks if its a new user or not
 * @param {*} req.params.email
 * @returns {JSON} if user exist
 *  {newUser:false, _id: String, email:String, number_of_charts: Number, credits: Number, last_login: Timestamp}
 * @returns {JSON} if user doesnt exist
 * {newUser:true, email: String, last_login: Timestamp}
 */
const userData = async (req, res) => {
  const email = req.query.email; // need body because of axios get
  if (!email) {
    throw new CustomAPIError(
      "Please provide email address",
      StatusCodes.BAD_REQUEST
    );
  }

  let newUser = false;
  let user = await User.findOne({ email });
  if (!user) {
    newUser = true;
    user = new User({
      email: email,
      last_login: Date.now(),
    });
  }


  return res.status(StatusCodes.OK).json({
    newUser: newUser,
    ...(user.toJSON())
  });
};

/**
 * @description saves user to database if found its a new user
 * @param {*} req.body {"newUser": Boolean, "email": String, "lastLoginTimestamp": timestamp}
 * @returns {JSON} {success: Boolean, msg: String}
 */
const saveUser = async (req, res) => {
  const { email, lastLoginTimestamp: last_login } = req.body.params; // need body because of axios post
  if (!email || !last_login) {
    throw new CustomAPIError(
      "Fields newUser: Boolean, email: String, lastLoginTimestamp: timestamp are required",
      StatusCodes.BAD_REQUEST
    );
  }

  await User.create({ email: email, last_login: last_login });

  const event = { email: email, credits: Number(0) };
  Producer.produce(event, stream);

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "User saved to db successfully" });
}



/**
 * @description updates last login attribute, front end has to save login time and when user log outs update the value
 * @param {body} req.body {email: String, lastLoginTimestamp: timestamp}
 * @returns {JSON} {success: Boolean, msg: String}
 * @publishes {_id: String, last_login: timestamp}
 */
const lastLoginUpdate = async (req, res) => {
  const { email, lastLoginTimestamp: last_login } = req.body;
  if (!email || !last_login) {
    throw new CustomAPIError(
      "Fields email: String, lastLoginTimestamp:timestamp are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CustomAPIError(
      "User doesn't exist in database",
      StatusCodes.NOT_FOUND
    );
  }

  await User.updateOne({ _id: user._id }, { $set: { last_login: last_login } });
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "User last login timestamp updated" });
};

module.exports = { userData, saveUser, lastLoginUpdate };
