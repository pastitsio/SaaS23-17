const CustomAPIError = require("../errors/custom-error");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

/**
 * @description gets user data from database and checks if its a new user or not
 * @param {*} req.params.email
 * @returns {JSON} {new_user:false, _id: String, email:String, number_of_charts: Number, credits: Number, last_login: Timestamp}
 * @returns {JSON} {new_user:true, email: String, last_login: Timestamp}
 */
// TODO: publish user udpated to kafka
const userData = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.OK).json({
      new_user: true,
      email,
      last_login: Date.now(),
    });
  }

  res.status(StatusCodes.OK).json({
    new_user: false,
    _id: user._id,
    email: user.email,
    number_of_charts: user.number_of_charts,
    credits: user.credits,
    last_login: user.last_login,
  });

};

/**
 * @description saves user to database if found its a new user
 * @param {*} req.body {"new_user": "", "email": "", "last_login":""}
 * @returns {JSON} {success: Boolean, msg: String}
*/
// TODO: publish user udpated to kafka
const saveUser = async (req, res) => {
  const { new_user, email, last_login } = req.body;

  if (!new_user || !email || !last_login) {
    throw new CustomAPIError(
      "Fields new_user: Boolean, email: String, last_login: timestamp are required",
      StatusCodes.BAD_REQUEST
    );
  }

  const user = await User.create({ email, last_login });
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "user saved to db successfully" });
};

/**
 * @description logs out user and updates last login attribute
 * @param {email} req.params.email
 * @returns {JSON} {success: Boolean, msg: String}
 */
//TODO: should backend handle the deletion of token?? => no
//TODO: publish user new last login 
const logout = async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    throw new CustomAPIError(
      "User doesn't exist in database",
      StatusCodes.BAD_REQUEST
    );
  }

  await User.updateOne({ _id: user._id }, { $set: { last_login: Date.now() } });
  console.log(Date.now());
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "User logged out successfully" });
};

module.exports = { userData, saveUser, logout };
