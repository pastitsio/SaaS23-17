const mongoose = require("mongoose");

const connectDB = (URI) => {
  return mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connection to DB successfull..."))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
