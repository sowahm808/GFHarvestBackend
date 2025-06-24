const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/quizzesController');

const router = express.Router();

router.get('/today', auth, controller.getTodayQuiz);
router.post('/submit', auth, controller.submitQuiz);
router.get('/history/:childId', auth, controller.getHistory);

module.exports = router;
