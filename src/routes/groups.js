const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const groupsController = require('../controllers/groupsController');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

// Groups
router.post('/create', auth, roleGuard(['parent', 'admin']), groupsController.createGroup);
router.post('/add-member', auth, roleGuard(['parent', 'admin']), groupsController.addMember);
router.post('/assign-mentor', auth, roleGuard(['parent', 'admin']), groupsController.assignMentor);

// Listing & Filtering
router.get('/', auth, groupsController.listGroups); // supports ?type=church&ageGroup=6-8
router.get('/:groupId', auth, groupsController.getGroup);
router.get('/child/:childId', auth, groupsController.getGroupsForChild);

// Group Points (existing routes)
router.get('/points', auth, pointsController.listGroupPoints);
router.get('/:groupId/points', auth, pointsController.getGroupPoints);

module.exports = router;
