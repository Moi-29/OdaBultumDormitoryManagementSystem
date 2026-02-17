const express = require('express');
const router = express.Router();
const {
    getPermissions,
    getStudentPermissions,
    createPermission,
    updatePermissionStatus,
    deletePermission,
    generatePermissionPDF,
    generateAllPermissionsPDF
} = require('../controllers/permissionController');
const { protect: adminProtect } = require('../middleware/adminAuth');
const { protect: multiProtect } = require('../middleware/multiAuthMiddleware');

// Public routes - students can submit and view their own permissions
router.post('/', createPermission);
router.get('/student/:studentId', getStudentPermissions);
router.get('/student-pdf/:id', generatePermissionPDF); // Allow students to download their own PDF

// Protected routes - accessible by admin
router.get('/', multiProtect, getPermissions);
router.patch('/:id/status', multiProtect, updatePermissionStatus);
router.delete('/:id', multiProtect, deletePermission);

// PDF generation routes
router.get('/:id/pdf', multiProtect, generatePermissionPDF);
router.get('/export/all-pdf', multiProtect, generateAllPermissionsPDF);

module.exports = router;
