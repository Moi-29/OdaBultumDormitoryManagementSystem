const express = require('express');
const router = express.Router();
const {
    getApplications,
    createApplication,
    updateApplication,
    toggleEditPermission,
    deleteApplication,
    bulkDeleteApplications,
    checkExistingApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createApplication);
router.get('/check/:studentId', checkExistingApplication);
router.put('/:id', updateApplication); // Allow public update if canEdit is true

// Protected routes (Admin only)
router.get('/', protect, getApplications);
router.patch('/:id/edit-permission', protect, toggleEditPermission);
router.delete('/bulk', protect, bulkDeleteApplications);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
