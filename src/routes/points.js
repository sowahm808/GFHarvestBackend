const express = require('express');
const auth = require('../middlewares/authMiddleware');
const pointsController = require('../controllers/pointsController');

const router = express.Router();

router.post('/grant', auth, pointsController.grantPoints);
router.get('/:childId', auth, pointsController.getChildPoints);

module.exports = router;
