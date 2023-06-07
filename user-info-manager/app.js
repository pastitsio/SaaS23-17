const cors = require("cors");
const express = require("express");
const path = require("path");

const db = require("./db/");
const { errorHandlerMiddleware, pageNotFound } = require("./middleware/");
const keycloak = require('./keycloak-config').initKeycloak();
const router = require("./routes/");

const dotenvFilePath = `${path.dirname(__filename)}/.env`
require("dotenv").config();


const port = process.env.APP_PORT || 5000;
const host = process.env.HOST || "localhost";


const app = express();
app.use(express.json());
app.use(cors());
app.use(keycloak.middleware()); // default to "/logout" for logout and "/" for root

// routes
app.use("/api/v1/", keycloak.protect('realm:user'), router); // protected
app.use("*", pageNotFound);

// error handler  
app.use(errorHandlerMiddleware);

// server spin-up + connection to db
const spinServer = async () => {
  try {
    await db.connect(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Running on http://${host}:${port}/api/v1 ...`)
    );
  } catch (error) {
    console.error(error);
  }
};

spinServer();
