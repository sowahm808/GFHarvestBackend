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
// Retrieve mentor records for either a child (parent view) or a mentor (their
// own records).  The controller inspects the authenticated user's role to
// decide whether to filter on `childId` or `mentorId`.
router.get('/:uid/records', auth, roleGuard(['parent', 'mentor']), recordsController.getRecords);

module.exports = router;
