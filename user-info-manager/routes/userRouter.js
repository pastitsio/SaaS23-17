const express = require("express");
const router = express.Router();
const {
  userData,
  saveUser,
  lastLoginUpdate,
} = require("../controllers/userControllers");
const authUser = require("../middleware/auth-user");

router.get("/:email", authUser, userData);
router.post("/lastLoginUpdate", authUser, lastLoginUpdate);
router.post("/newUser", authUser, saveUser);

module.exports = router;
