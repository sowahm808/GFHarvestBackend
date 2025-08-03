const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

router.post('/grant', auth, childAccess, pointsController.grantPoints);
router.get('/:childId/stream', auth, childAccess, pointsController.streamChildPoints);
router.get('/:childId', auth, childAccess, pointsController.getChildPoints);

module.exports = router;
