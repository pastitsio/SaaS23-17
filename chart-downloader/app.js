// TODO: schema complete encoding (userid type, chart type)
// TODO: create dummy data for population of db
// TODO:
// TODO:
// TODO:
// TODO:

const express = require("express");
const connectDB = require("./db/connectDB");
const app = express();

require('dotenv').config();

const host = process.env.HOST || "localhost";
const port = process.env.APP_PORT || 3000;

// middleware

// routes
app.get("/", (req, res) => res.status(200).send("app is working"));

// error-handler

// spin server
const spinServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, ()=>console.log(`Server listening on http://${host}:${port}`))
  } catch (error) {
    console.log(error);
  }
};

spinServer();
