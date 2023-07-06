const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true
  },
  last_login: {
    type: Date,
    default: Date.now()
  },
  number_of_charts: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
});

const User = mongoose.model("User", UserSchema)

module.exports = User;
