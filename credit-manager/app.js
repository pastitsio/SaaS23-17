const express = require("express");
const app = express();
const router = require("./routes/creditManagerRouter");
const connectDB = require("./db/connectDB");
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/errorHandlerMiddleware");

const cors = require("cors");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
require("dotenv").config();

const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || "localhost";

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

// middleware
app.use(express.json());
app.use(cors());

app.use(
  session({
    store: memoryStore,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// routes
app.use("/api/v1/", keycloak.protect("realm:user"), router);
app.get("/", keycloak.protect("realm:user"), (req, res) => {
  res.json({ token: req.kauth.grant.access_token.token });
});
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
