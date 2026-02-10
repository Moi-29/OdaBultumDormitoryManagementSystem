const express = require('express');
const router = express.Router();
const {
    multiRoleLogin,
    getMe,
    changePassword,
    logout
} = require('../controllers/multiAuthController');
const { protect } = require('../middleware/multiAuthMiddleware');

// Public routes
router.post('/login', multiRoleLogin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
