const express = require("express");

const { userController } = require("../controllers/");
const { authUser } = require('../middleware');

const router = express.Router();

router.get("/user", authUser, userController.userData);
router.post("/lastLoginUpdate", authUser, userController.lastLoginUpdate);
router.post("/newUser", authUser, userController.saveUser);

module.exports = router;
