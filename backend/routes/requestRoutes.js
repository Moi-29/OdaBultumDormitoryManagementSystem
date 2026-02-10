const express = require('express');
const router = express.Router();
const {
    getRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/adminAuth');

// Public route - students can submit requests
router.post('/', createRequest);

// Admin routes - require authentication
router.get('/', protect, getRequests);
router.patch('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
