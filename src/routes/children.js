const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/childrenController');

const router = express.Router();

router.get('/:childId', auth, controller.getChildProfile);

module.exports = router;
