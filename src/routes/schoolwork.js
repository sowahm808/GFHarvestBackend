const express = require('express');
const auth = require('../middlewares/authMiddleware');
const schoolworkController = require('../controllers/schoolworkController');

const router = express.Router();

router.post('/', auth, schoolworkController.submitEntry);
router.get('/:childId', auth, schoolworkController.getEntries);

module.exports = router;
