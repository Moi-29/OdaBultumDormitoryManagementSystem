const Message = require('../models/Message');

// @desc    Get messages for a request
// @route   GET /api/messages/:requestId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const messages = await Message.find({ requestId })
            .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res) => {
    try {
        const { requestId, senderId, senderModel, senderName, message } = req.body;

        if (!requestId || !message) {
            return res.status(400).json({ message: 'Request ID and message are required' });
        }

        const newMessage = await Message.create({
            requestId,
            senderId: senderId || req.user?._id,
            senderModel: senderModel || 'Admin',
            senderName: senderName || req.user?.username || 'Admin',
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getMessages,
    createMessage,
    deleteMessage
};
