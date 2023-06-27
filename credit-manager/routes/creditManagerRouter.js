const express = require('express');
const router = express.Router();
const { purchase } = require('../controllers/creditManagerControllers');
const auth = require('../middleware/authUser');

router.post('/purchaseCredits', auth, purchase);

module.exports = router;