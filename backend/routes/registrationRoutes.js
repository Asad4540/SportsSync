const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Multer configuration for payment screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// User routes (require authentication)
router.post('/', authMiddleware, upload.single('paymentScreenshot'), registrationController.createRegistration);
router.get('/my', authMiddleware, registrationController.getMyRegistrations);
router.get('/:id', authMiddleware, registrationController.getRegistrationById);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, registrationController.getAllRegistrations);
router.put('/:id/status', authMiddleware, adminMiddleware, registrationController.updateRegistrationStatus);
router.delete('/:id', authMiddleware, adminMiddleware, registrationController.deleteRegistration);

module.exports = router;
