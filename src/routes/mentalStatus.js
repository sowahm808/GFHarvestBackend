const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const controller = require('../controllers/mentalStatusController');

const router = express.Router();

router.post('/', auth, childAccess, controller.submitEntry);
router.get('/:childId', auth, childAccess, controller.getEntries);

module.exports = router;
