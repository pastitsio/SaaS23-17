require("dotenv").config();

const connectDB = require("./connectDB");
const Credits = require("../models/Credits");
const jsonCredits = require("./Credits.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Credits.deleteMany();
    await Credits.create(jsonCredits);
    console.log("Success!!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
