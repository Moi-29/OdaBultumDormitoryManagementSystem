const express = require('express');
const router = express.Router();
const {
    getRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest,
    bulkDeleteRequests,
    markRequestAsRead
} = require('../controllers/requestController');
const { protect: adminProtect } = require('../middleware/adminAuth');
const { protect: multiProtect } = require('../middleware/multiAuthMiddleware');

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

// Protected routes - accessible by admin, proctor, and maintainer
router.get('/', multiProtect, getRequests);
router.post('/bulk-delete', adminProtect, bulkDeleteRequests);
router.patch('/:id/status', multiProtect, updateRequestStatus);
router.patch('/:id/read', multiProtect, markRequestAsRead);
router.delete('/:id', multiProtect, deleteRequest);

module.exports = router;
