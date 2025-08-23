const express = require('express');
const router = express.Router();
const controller = require('../controllers/prayerRequestsController');

router.post('/', controller.addRequest);
router.get('/', controller.listRequests);
router.patch('/:id', controller.updateRequest);
router.patch('/:id/prayed', controller.markPrayed);

module.exports = router;
