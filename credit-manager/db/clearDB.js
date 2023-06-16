require("dotenv").config({ path: '../.env'});

const connectDB = require("./connectDB");
const User = require("../models/Credits");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await User.deleteMany();
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
