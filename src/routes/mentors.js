// routes/mentors.js
const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorsController');
const recordsController = require('../controllers/mentorRecordsController');

const router = express.Router();

// Health check (safe to leave in prod)
router.get('/ping', (_req, res) => res.json({ ok: true, route: 'mentors' }));

// All routes below require authentication
router.use(auth);

const adminOnly = roleGuard(['admin']);
const parentOnly = roleGuard(['parent']);
const mentorOnly = roleGuard(['mentor']);
const parentOrMentor = roleGuard(['parent', 'mentor']);

// Mentor management (admin only)
router
  .route('/')
  .post(adminOnly, controller.createMentor)
  .get(adminOnly, controller.listMentors);

// Assign mentor to child (parent only)
router.post('/assign', parentOnly, controller.assignMentor);

// Get children assigned to a mentor
router.get('/:mentorId/children', controller.getChildren);

// Mentor records
router.post('/records', mentorOnly, recordsController.createRecord);
router.get('/:uid/records', parentOrMentor, recordsController.getRecords);

module.exports = router;
