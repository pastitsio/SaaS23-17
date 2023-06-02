// TODO: schema complete encoding (userid type, chart type)
// TODO: create dummy data for population of db
// TODO:
// TODO:
// TODO:
// TODO:

const express = require("express");
const app = express();
const connectDB = require("./db/connectDB");
const chartDowload = require("./controllers/chartDownloader");
const pageNotFound = require("./middleware/pageNotFound");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");
const auth = require("./middleware/authUser");

require("dotenv").config();
const cors = require("cors");
const Keycloak = require("keycloak-connect");
const session = require("express-session");

const host = process.env.HOST || "localhost";
const port = process.env.APP_PORT || 3000;
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

// middleware
app.use(cors());

app.use(
  session({
    store: memoryStore,
    secret: process.env.SECRET,
    resave: false,
  })
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// routes
app.get("/:email", keycloak.protect("realm:user"), auth, chartDowload);
app.get("/", keycloak.protect("realm:user"), (req, res) => {
  res.json({ token: req.kauth.grant.access_token.token });
});
app.use("*", pageNotFound);

// error-handler
app.use(errorHandlerMiddleware);

// spin server
const spinServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server listening on http://${host}:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

spinServer();
