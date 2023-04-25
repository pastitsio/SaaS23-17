// TODO: add keycloak authorization to endpoints
// TODO: make error communication more humane to the user

const express = require("express");
const app = express();
const router = require("./routes/userRouter");
const connectDB = require("./db/connectDB");

const pageNotFound = require("./middleware/page-not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

const port = process.env.PORT || 6000;
const host = process.env.HOST || "localhost";

// middleware
app.use(express.static("../front-end/public"));
app.use(express.json());
app.use(cors());
app.use(errorHandlerMiddleware);

// routes
app.use("/api/v1/", router);
app.use("*", pageNotFound);

// server spin-up + connection to db
const spinServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Running on http://${host}:${port}/api/v1 ...`)
    );
  } catch (error) {
    console.error(error);
  }
};

spinServer();
