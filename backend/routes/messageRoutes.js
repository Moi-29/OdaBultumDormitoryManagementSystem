const express = require('express');
const router = express.Router();
const {
    getMessages,
    createMessage,
    deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/adminAuth');

// All routes require authentication
router.get('/:requestId', protect, getMessages);
router.post('/', protect, createMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
