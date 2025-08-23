const express = require('express');
const router = express.Router();
const controller = require('../controllers/churchesController');

router.post('/', controller.createChurch);
router.get('/', controller.listChurches);

module.exports = router;
