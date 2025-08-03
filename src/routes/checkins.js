const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const checkinsController = require('../controllers/checkinsController');

const router = express.Router();

router.post('/', auth, childAccess, checkinsController.submitCheckin);
router.get('/:childId', auth, childAccess, checkinsController.getCheckins);

module.exports = router;
