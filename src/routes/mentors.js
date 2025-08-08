// routes/mentors.js
const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorsController');
const recordsController = require('../controllers/mentorRecordsController');

const router = express.Router();

// Health check (safe to leave in prod)
router.get('/ping', (_req, res) => res.json({ ok: true, route: 'mentors' }));

// Create mentor (admin only) — RESTful
router.post('/', auth, roleGuard(['admin']), controller.createMentor);

// List mentors (admin only)
router.get('/', auth, roleGuard(['admin']), controller.listMentors);

// Assign mentor to child (parent only)
router.post('/assign', auth, roleGuard(['parent']), controller.assignMentor);

// Get children assigned to a mentor
router.get('/:mentorId/children', auth, controller.getChildren);

// Mentor records
router.post('/records', auth, roleGuard(['mentor']), recordsController.createRecord);
router.get('/:uid/records', auth, roleGuard(['parent', 'mentor']), recordsController.getRecords);

module.exports = router;
