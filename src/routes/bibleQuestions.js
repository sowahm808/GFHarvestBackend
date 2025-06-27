const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/bibleQuestionsController');

const router = express.Router();

router.get('/', auth, controller.getQuestions);
router.get('/:id', auth, controller.getQuestion);

module.exports = router;
