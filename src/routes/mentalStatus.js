const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/mentalStatusController');

const router = express.Router();

router.post('/', auth, controller.submitEntry);
router.get('/:childId', auth, controller.getEntries);

module.exports = router;
