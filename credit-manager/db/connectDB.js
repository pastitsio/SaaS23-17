const mongoose = require("mongoose");

const connectDB = (URI) => {
  return mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connection with DB successful..."));
};

module.exports = connectDB;
