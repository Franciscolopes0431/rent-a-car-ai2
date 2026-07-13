const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const controller = require('../controllers/notificationController');
const router = express.Router();
router.use(authenticate);
router.get('/', controller.listNotifications);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', controller.markRead);
module.exports = router;
