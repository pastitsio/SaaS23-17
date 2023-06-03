const express = require('express');
const router = express.Router();
const {udpate, purchase} = require('../controllers/creditManagerControllers');
const auth = require('../middleware/authUser');

router.post('/purchaseCredits', auth, purchase);
router.post('/updateBalance', auth, udpate);

module.exports = router;