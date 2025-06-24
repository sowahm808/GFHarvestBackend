const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const groupsController = require('../controllers/groupsController');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

router.post('/create', auth, groupsController.createGroup);
router.post('/add-member', auth, groupsController.addMember);
router.get('/:groupId', auth, groupsController.getGroup);
router.get('/', auth, roleGuard('admin'), groupsController.listGroups);
router.get('/:groupId/points', auth, pointsController.getGroupPoints);

module.exports = router;
