require("dotenv").config({ path: "../.env" });
const connectDB = require("./connectDB");
const Chart = require('../models/Chart'); 
const chart = require("./Charts.json");

const populate = async (URI) => {
  try {
    await connectDB(URI);
    await Chart.deleteMany();
    await Chart.create(chart);
    console.log("DB populated successfully...");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

populate(process.env.MONGO_URI);
