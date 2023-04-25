const express = require('express');
const router = express.Router();
const {userData, saveUser} = require("../controllers/userControllers");

router.get('/:email',userData);
router.post('/newuser', saveUser);

module.exports = router;
