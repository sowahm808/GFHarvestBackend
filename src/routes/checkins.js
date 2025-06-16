const express = require('express');
const auth = require('../middlewares/authMiddleware');
const checkinsController = require('../controllers/checkinsController');

const router = express.Router();

router.post('/', auth, checkinsController.submitCheckin);
router.get('/:childId', auth, checkinsController.getCheckins);

module.exports = router;
