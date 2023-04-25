const express = require('express');
const router = express.Router();
const {userData, saveUser, logout} = require("../controllers/userControllers");

router.get('/:email',userData);
router.get('/logout/:email',logout);
router.post('/newuser', saveUser);

module.exports = router;

