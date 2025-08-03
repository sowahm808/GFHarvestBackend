const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const controller = require('../controllers/quizzesController');

const router = express.Router();

router.get('/today', auth, controller.getTodayQuiz);
router.post('/submit', auth, childAccess, controller.submitQuiz);
router.get('/history/:childId', auth, childAccess, controller.getHistory);

module.exports = router;
