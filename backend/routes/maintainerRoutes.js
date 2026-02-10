const express = require('express');
const router = express.Router();
const {
    getProfile,
    createRequest,
    getRequests,
    getWorkOrders,
    updateWorkOrder,
    replyToWorkOrder,
    getStats,
    updateProfile
} = require('../controllers/maintainerController');
const { protect, restrictTo } = require('../middleware/multiAuthMiddleware');

// All routes require authentication and maintainer role
router.use(protect);
router.use(restrictTo('maintainer'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Request routes
router.post('/requests', createRequest);
router.get('/requests', getRequests);

// Work order routes
router.get('/work-orders', getWorkOrders);
router.patch('/work-orders/:id', updateWorkOrder);
router.post('/work-orders/:id/reply', replyToWorkOrder);

// Statistics
router.get('/stats', getStats);

module.exports = router;
