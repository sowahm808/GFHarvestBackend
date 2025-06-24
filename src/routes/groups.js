const express = require('express');
const auth = require('../middlewares/authMiddleware');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

router.get('/:groupId/points', auth, pointsController.getGroupPoints);

module.exports = router;
