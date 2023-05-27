const express = require("express");
const app = express();
const router = require("./routes/creditManagerRouter");
const connectDB = require("./db/connectDB");
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/errorHandlerMiddleware");

const cors = require("cors");
require("dotenv").config();

const port = process.env.APP_PORT || 3000;
const host = process.env.HOST || "localhost";

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/", router);
// app.get("/", keycloak.protect("realm:user"), (req, res) => {
//   res.json({ token: req.kauth.grant.access_token.token });
// });
app.use("*", pageNotFound);

// error-handler
app.use(errorHandler);

// server spin-up + connection to db
const serverSpin = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on http://${host}:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

serverSpin();
