const express = require('express');
const router = express.Router();
const {
    getRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { adminAuth } = require('../middleware/adminAuth');

// Public route - students can submit requests
router.post('/', createRequest);

// Admin routes - require authentication
router.get('/', protect, adminAuth, getRequests);
router.patch('/:id/status', protect, adminAuth, updateRequestStatus);
router.delete('/:id', protect, adminAuth, deleteRequest);

module.exports = router;
