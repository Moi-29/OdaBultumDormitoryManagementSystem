const express = require('express');
const router = express.Router();
const {
    getRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/adminAuth');

// Public routes - students can submit and view their own requests
router.post('/', createRequest);
router.get('/student/:studentId', async (req, res) => {
    try {
        const Request = require('../models/Request');
        const { studentId } = req.params;
        
        const requests = await Request.find({ 
            studentId: studentId,
            fromUserModel: 'Student'
        }).sort({ createdAt: -1 });
        
        res.json(requests);
    } catch (error) {
        console.error('Error fetching student requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin routes - require authentication
router.get('/', protect, getRequests);
router.patch('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
