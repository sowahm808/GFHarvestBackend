const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const controller = require('../controllers/essaysController');

const router = express.Router();

router.post('/', auth, childAccess, controller.createOrUpdate);
router.get('/:childId', auth, childAccess, controller.getProgress);

module.exports = router;
