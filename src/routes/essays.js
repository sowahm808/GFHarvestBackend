const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/essaysController');

const router = express.Router();

router.post('/', auth, controller.createOrUpdate);
router.get('/:childId', auth, controller.getProgress);

module.exports = router;
