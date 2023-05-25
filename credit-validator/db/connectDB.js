const mongoose = require("mongoose");

const connectDB = (URI) => {
  return mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("connected to db successfully"));
};

module.exports = connectDB;
