const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/childrenController');

const router = express.Router();

router.get('/', auth, roleGuard('admin'), controller.listChildren);
router.get('/:childId', auth, childAccess, controller.getChildProfile);

module.exports = router;
