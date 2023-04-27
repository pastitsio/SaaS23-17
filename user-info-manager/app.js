// TODO: add keycloak authorization to endpoints
// TODO: make error communication more humane to the user

const express = require("express");
const app = express();
const router = require("./routes/userRouter");
const connectDB = require("./db/connectDB");

const pageNotFound = require("./middleware/page-not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const cors = require("cors");
// const Keycloak = require("keycloak-connect");
// const session = require("express-session");
require("dotenv").config();
require("express-async-errors");

const port = process.env.APP_PORT || 5000;
const host = process.env.HOST || "localhost";
// const memoryStore = new session.MemoryStore();
// const keycloak = new Keycloak({ store: memoryStore });

// middleware
app.use(express.static("../front-end/public"));
app.use(express.json());
app.use(cors());
app.use(errorHandlerMiddleware);
// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   store: memoryStore,
// }));
// app.use(keycloak.middleware({
//   logout: '/logout',
//   admin:'/'
// }))

// routes
// app.use("/api/v1/", keycloak.protect("realm:user"), router);
app.use("/api/v1/",  router);
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
