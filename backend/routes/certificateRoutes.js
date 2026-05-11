const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route - generate certificate PDF
router.get('/:registrationId', authMiddleware, certificateController.generateCertificate);

module.exports = router;
