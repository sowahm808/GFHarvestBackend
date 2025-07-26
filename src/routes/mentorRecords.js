const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorRecordsController');

const router = express.Router();

router.post('/records', auth, roleGuard(['mentor']), controller.createRecord);
router.get('/:childId/records', auth, roleGuard(['parent', 'mentor']), controller.getRecords);

module.exports = router;
