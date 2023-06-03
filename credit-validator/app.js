const express = require("express");
const app = express();

const connectDB = require("./db/connectDB");
const validateCredit = require("./controllers/creditValidatorControllers");
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/error-handler");
const authUser = require("./middleware/authUser");
const cors = require("cors");
const Keycloak = require("keycloak-connect");
const session = require("express-session");

require("express-async-errors");
require("dotenv").config();


const port = process.env.APP_PORT || 5000;
const host = process.env.HOST || "localhost";
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

// middleware
// app.use(express.static("../front-end/public"));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    store: memoryStore,
    saveUninitialized: false
  })
);
app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// test routes
app.get("/",  keycloak.protect("realm:user"), (req, res) => {
  res.json({token: req.kauth.grant.access_token.token});
});

// routes
app.get(
  "/api/v1/creditValidation",
  keycloak.protect("realm:user"),
  authUser,
  validateCredit
);
app.use("*", pageNotFound);

// error-handler
app.use(errorHandler);

// server-spin up
const spinServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Running on http://${host}:${port}/`)
    );
  } catch (error) {
    console.error(error);
  }
};

spinServer();
