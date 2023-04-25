const CustomAPIError = require("../errors/custom-error");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

/**
 * @param {*} req.params.email
 * @returns {JSON} {new_user:false, _id: String, email:String, number_of_charts: Number, credits: Number, last_login: Timestamp}
 * @returns {JSON} {new_user:true, email: String, last_login: Timestamp}
 */
const userData = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  const timestamp = Date.now();
  if (!user) {
    return res.status(StatusCodes.OK).json({
      new_user: true,
      email,
      last_login: timestamp,
    });
  }

  await User.updateOne(
    { _id: user._id },
    { $set: { last_login: timestamp } }
  );

  res.status(StatusCodes.OK).json({
    new_user: false,
    _id: user._id,
    email: user.email,
    number_of_charts: user.number_of_charts,
    credits: user.credits,
    last_login: timestamp,
  });

  // TODO: publish user udpated to kafka
  // TODO: error logging when asking things from db
};

/**
 *
 * @param {*} req.body {"new_user": "", "email": "", "last_login":""}
 * @returns {JSON} {success: Boolean, user: Object}
 */
const saveUser = async (req, res) => {
  const { new_user, email, last_login } = req.body;

  if (!new_user || !email || !last_login) {
    throw new CustomAPIError(
      "Fields new_user: Boolean, email: String, last_login: timestamp are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.create({ email, last_login });
  res.status(StatusCodes.OK).json({ success: true, user });
  // TODO: publish user udpated to kafka
  // TODO: error logging more friendly to user
};

module.exports = { userData, saveUser };
