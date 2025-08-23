const express = require('express');
const router = express.Router();
const controller = require('../controllers/churchesController');

router.post('/', controller.createChurch);
router.get('/', controller.listChurches);
router.get('/:id', controller.getChurch);
router.patch('/:id', controller.updateChurch);

module.exports = router;
