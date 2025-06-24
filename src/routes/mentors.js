const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/mentorsController');

const router = express.Router();

router.post('/assign', auth, roleGuard(['parent']), controller.assignMentor);
router.get('/:mentorId/children', auth, controller.getChildren);

module.exports = router;
