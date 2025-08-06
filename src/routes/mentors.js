const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorsController');
const recordsController = require('../controllers/mentorRecordsController');

const router = express.Router();

router.post('/create', auth, roleGuard(['admin']), controller.createMentor);
router.get('/', auth, roleGuard(['admin']), controller.listMentors);
router.post('/assign', auth, roleGuard(['parent']), controller.assignMentor);
router.get('/:mentorId/children', auth, controller.getChildren);
router.post('/records', auth, roleGuard(['mentor']), recordsController.createRecord);
router.get('/:childId/records', auth, roleGuard(['parent', 'mentor']), recordsController.getRecords);

module.exports = router;
