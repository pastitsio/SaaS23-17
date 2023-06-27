const express = require('express');
const router = express.Router();
const auth = require('../middleware/authUser');
const { purchase } = require('../controllers/creditManagerControllers');

router.post('/purchaseCredits', auth, purchase);

module.exports = router;