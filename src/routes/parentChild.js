const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const controller = require('../controllers/parentChildController');

const router = express.Router();

router.post('/link', auth, roleGuard(['admin']), controller.linkParentChild);
router.post('/unlink', auth, roleGuard(['admin']), controller.unlinkParentChild);
router.get('/:parentId/children', auth, roleGuard(['admin', 'parent']), controller.getChildrenForParent);

module.exports = router;
