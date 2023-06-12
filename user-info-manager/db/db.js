const mongoose = require("mongoose");
const path = require('path');
const { User } = require('../models')

const dotenvFilePath = `${path.dirname(__filename)}/../.env`
require("dotenv").config({ path: dotenvFilePath});

const connect = async (URI) => {
  try {
    await mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    return console.log("Connection to DB successfull...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const populate = async (jsonUsers) => {
  try {
    await connect(process.env.MONGO_URI);
    await User.deleteMany();
    await User.create(jsonUsers);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


const clear = async () => {
  try {
    await connect(process.env.MONGO_URI);
    await User.deleteMany();
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};



module.exports = {
  clear,
  connect,
  populate
};
