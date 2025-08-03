const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const schoolworkController = require('../controllers/schoolworkController');

const router = express.Router();

router.post('/', auth, childAccess, schoolworkController.submitEntry);
router.get('/:childId', auth, childAccess, schoolworkController.getEntries);

module.exports = router;
