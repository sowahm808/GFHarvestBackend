const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const controller = require('../controllers/childrenController');

const router = express.Router();

router.get('/:childId', auth, childAccess, controller.getChildProfile);

module.exports = router;
