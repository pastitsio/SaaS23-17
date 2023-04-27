const express = require('express');
const router = express.Router();
const {userData, saveUser,  lastLoginUpdate} = require("../controllers/userControllers");

router.get('/:email',userData);
router.post('/lastloginupdate', lastLoginUpdate);
router.post('/newuser', saveUser);

module.exports = router;

