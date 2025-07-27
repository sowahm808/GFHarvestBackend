const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const groupsController = require('../controllers/groupsController');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

router.post('/create', auth, groupsController.createGroup);
router.post('/add-member', auth, groupsController.addMember);
router.get('/points', auth, pointsController.listGroupPoints);
router.get('/:groupId/points', auth, pointsController.getGroupPoints);
router.get('/:groupId', auth, groupsController.getGroup);
router.get('/', auth, roleGuard('admin'), groupsController.listGroups);

module.exports = router;
