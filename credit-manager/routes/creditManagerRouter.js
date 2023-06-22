const express = require('express');
const router = express.Router();
const {update, purchase} = require('../controllers/creditManagerControllers');
const auth = require('../middleware/authUser');

router.post('/purchaseCredits', auth, purchase);
router.post('/updateBalance', auth, update);

module.exports = router;