const express = require('express');
const auth = require('../middlewares/authMiddleware');
const roleGuard = require('../middlewares/roleGuard');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/register-parent', usersController.registerParent);
router.post('/register-admin', usersController.registerAdmin);
router.post('/add-child', auth, roleGuard(['parent']), usersController.addChild);
router.get('/me', auth, usersController.getMe);
router.post('/set-admin', auth, roleGuard(['admin']), usersController.setAdminRole);

module.exports = router;
