const express = require("express");

const { userController } = require("../controllers/");


const router = express.Router();

router.get("/:email", userController.userData);
router.post("/lastLoginUpdate", userController.lastLoginUpdate);
router.post("/newUser", userController.saveUser);

module.exports = router;
