const express = require("express");
const app = express();
const router = require("./routes/user");
const connectDB = require("./db/connectDB");

const errorHandlerMiddleware = require("./middleware/error-handler")
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";

// middleware
app.use(express.static("../front-end/public"));
app.use(express.json());
app.use(cors());
app.use(errorHandlerMiddleware);

// routes
app.use("/api/v1/", router);

// server spin-up + connection to db
const spinServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, ()=>
      console.log(`Running on http://${host}:${port}/api/v1 ...`)
    );
  } catch (error) {
    console.error(error);
  }
};

spinServer();







//---------------KEYCLOAK-veskoukis--------------------

// const session = require("express-session");
// const Keycloak = require("keycloak-connect");
// const memoryStore = new session.MemoryStore();
// const keycloak = new Keycloak({ store: memoryStore });

// app.use(
//   session({
//     secret: "some secret",
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore,
//   })
// );

// app.use(keycloak.middleware({ logout: "/logout", admin: "/" }));

// app.get(
//   "/service/secured",
//   keycloak.protect("realm:user"),
//   function (req, res) {
//     console.log("req.kauth.grant");
//     res.json({ message: "secured" });
//   }
// );

// app.get("/service/admin", keycloak.protect("realm:admin"), function (req, res) {
//   res.json({ message: "admin" });
// });

//-----------------------------------
