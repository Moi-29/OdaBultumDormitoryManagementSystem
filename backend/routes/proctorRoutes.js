const express = require('express');
const router = express.Router();
const {
    getProfile,
    createReport,
    getReports,
    getMessages,
    replyToMessage,
    getStats,
    updateProfile
} = require('../controllers/proctorController');
const { protect, restrictTo, proctorBlockRestriction } = require('../middleware/multiAuthMiddleware');

// All routes require authentication and proctor role
router.use(protect);
router.use(restrictTo('proctor'));
router.use(proctorBlockRestriction);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Report routes
router.post('/reports', createReport);
router.get('/reports', getReports);

// Message routes
router.get('/messages', getMessages);
router.post('/messages/:id/reply', replyToMessage);

// Statistics
router.get('/stats', getStats);

module.exports = router;
