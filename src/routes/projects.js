const express = require('express');
const auth = require('../middlewares/authMiddleware');
const childAccess = require('../middlewares/childAccess');
const projectsController = require('../controllers/projectsController');

const router = express.Router();

router.post('/', auth, childAccess, projectsController.upsertProject);
router.get('/:childId', auth, childAccess, projectsController.getProjects);

module.exports = router;
