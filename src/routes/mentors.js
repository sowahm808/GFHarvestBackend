const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorsController');
const recordsController = require('../controllers/mentorRecordsController');

const router = express.Router();

// Create mentor (admin only)
router.post('/', auth, roleGuard(['admin']), controller.createMentor);         // Preferred RESTful
router.post('/create', auth, roleGuard(['admin']), controller.createMentor);  // Legacy support

// List mentors (admin only)
router.get('/', auth, roleGuard(['admin']), controller.listMentors);

// Assign mentor to child (parent only)
router.post('/assign', auth, roleGuard(['parent']), controller.assignMentor);

// Get children assigned to a mentor
router.get('/:mentorId/children', auth, controller.getChildren);

// Create a mentor record (mentor only)
router.post('/records', auth, roleGuard(['mentor']), recordsController.createRecord);

// Get mentor records for a child or mentor based on role
router.get('/:uid/records', auth, roleGuard(['parent', 'mentor']), recordsController.getRecords);

module.exports = router;
