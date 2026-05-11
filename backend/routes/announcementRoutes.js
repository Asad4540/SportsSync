const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', announcementController.getAllAnnouncements);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, announcementController.createAnnouncement);
router.put('/:id', authMiddleware, adminMiddleware, announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, adminMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
