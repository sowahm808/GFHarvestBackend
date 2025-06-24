const express = require('express');
const auth = require('../middlewares/authMiddleware');
const projectsController = require('../controllers/projectsController');

const router = express.Router();

router.post('/', auth, projectsController.upsertProject);
router.get('/:childId', auth, projectsController.getProjects);

module.exports = router;
