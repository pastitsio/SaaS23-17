const User = require("../models/User");
const CustomAPIError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");
const queueMessage = require("../../choreographer/kafka/kafka-publisher");
const { producerCreate } = require("../../choreographer/kafka/kafka-connect");

// connect to kafka as a publisher
const stream = producerCreate("user-data");

/**
 * @description gets user data from database and checks if its a new user or not
 * @param {*} req.params.email
 * @returns {JSON} {newUser:false, _id: String, email:String, number_of_charts: Number, credits: Number, last_login: Timestamp}
 * @returns {JSON} {newUser:true, email: String, last_login: Timestamp}
 */
const userData = async (req, res) => {
  const email = req.params.email;
  if (!email) {
    throw new CustomAPIError(
      "Please provide email address",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.OK).json({
      newUser: true,
      email,
      last_login: Date.now(),
    });
  }

  res.status(StatusCodes.OK).json({
    newUser: false,
    _id: user._id,
    email: user.email,
    number_of_charts: user.number_of_charts,
    credits: user.credits,
    last_login: user.last_login,
  });
};

/**
 * @description saves user to database if found its a new user
 * @param {*} req.body {"newUser": Boolean, "email": String, "lastLoginTimestamp": timestamp}
 * @returns {JSON} {success: Boolean, msg: String}
 */
const saveUser = async (req, res) => {
  const { newUser, email, lastLoginTimestamp: last_login } = req.body;
  if (!newUser || !email || !last_login) {
    throw new CustomAPIError(
      "Fields newUser: Boolean, email: String, last_login: timestamp are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.create({ email: email, last_login: last_login });
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "user saved to db successfully" });

  queueMessage({ email, last_login: Number(last_login) }, stream);
};

/**
 * @description logs out user and updates last login attribute
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

  queueMessage({ email, last_login: Number(last_login) }, stream);
};

module.exports = { userData, saveUser, lastLoginUpdate };
