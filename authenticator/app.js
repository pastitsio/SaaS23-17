const express = require("express");
const app = express();
const router = require("./routes/authRouter");
const cors = require("cors");
const port = process.env.PORT || 5000;
const host = process.env.HOST || "localhost";


//---------------KEYCLOAK--------------------
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware({ logout: "/logout", admin: "/" }));

app.get(
  "/service/secured",
  keycloak.protect("realm:user"),
  function (req, res) {
    console.log("req.kauth.grant");
    res.json({ message: "secured" });
  }
);

app.get("/service/admin", keycloak.protect("realm:admin"), function (req, res) {
  res.json({ message: "admin" });
});

//-----------------------------------


// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/", router);

// server spin-up
app.listen(port, () =>
  console.log(`Running on http://${host}:${port}/api/v1 ...`)
);
