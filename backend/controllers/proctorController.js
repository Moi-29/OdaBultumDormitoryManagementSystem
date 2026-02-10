const Proctor = require('../models/Proctor');
const Request = require('../models/Request');
const Room = require('../models/Room');

// @desc    Get proctor profile
// @route   GET /api/proctor/profile
// @access  Private (Proctor)
const getProfile = async (req, res) => {
    try {
        const proctor = await Proctor.findById(req.user.id).select('-password');
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Get block information from Room collection (real data)
        const rooms = await Room.find({ building: proctor.blockId });
        const blockInfo = rooms.length > 0 ? {
            name: proctor.blockId,
            gender: rooms[0].gender,
            totalRooms: rooms.length,
            totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
            occupied: rooms.reduce((sum, r) => sum + r.occupants.length, 0)
        } : { name: proctor.blockId };

        res.json({
            success: true,
            proctor,
            block: blockInfo
        });
    } catch (error) {
        console.error('Error fetching proctor profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a report (proctor to admin)
// @route   POST /api/proctor/reports
// @access  Private (Proctor)
const createReport = async (req, res) => {
    try {
        const { subject, message, priority, currentRoom } = req.body;

        // Validation
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Create report
        const report = await Request.create({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            fromUserName: proctor.fullName,
            toUserModel: 'Admin',
            requestType: 'Report',
            subject,
            message,
            blockId: proctor.blockId,
            priority: priority || 'medium',
            currentRoom,
            status: 'pending',
            submittedOn: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report
        });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get proctor's reports
// @route   GET /api/proctor/reports
// @access  Private (Proctor)
const getReports = async (req, res) => {
    try {
        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Get all reports created by this proctor
        const reports = await Request.find({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            blockId: proctor.blockId // Security: Ensure block restriction
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get incoming messages/requests from admin
// @route   GET /api/proctor/messages
// @access  Private (Proctor)
const getMessages = async (req, res) => {
    try {
        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Get messages sent to this proctor
        const messages = await Request.find({
            toUserId: proctor._id,
            toUserModel: 'Proctor',
            blockId: proctor.blockId // Security: Ensure block restriction
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reply to admin message
// @route   POST /api/proctor/messages/:id/reply
// @access  Private (Proctor)
const replyToMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const messageId = req.params.id;

        if (!message) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Verify the original message belongs to this proctor
        const originalMessage = await Request.findOne({
            _id: messageId,
            toUserId: proctor._id,
            blockId: proctor.blockId // Security check
        });

        if (!originalMessage) {
            return res.status(404).json({ message: 'Message not found or access denied' });
        }

        // Create reply as a new request
        const reply = await Request.create({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            fromUserName: proctor.fullName,
            toUserModel: 'Admin',
            requestType: 'Message',
            subject: `Re: ${originalMessage.subject}`,
            message,
            blockId: proctor.blockId,
            priority: originalMessage.priority,
            status: 'pending',
            submittedOn: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            success: true,
            message: 'Reply sent successfully',
            reply
        });
    } catch (error) {
        console.error('Error replying to message:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get block statistics
// @route   GET /api/proctor/stats
// @access  Private (Proctor)
const getStats = async (req, res) => {
    try {
        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Get block info from Room collection (real data)
        const rooms = await Room.find({ building: proctor.blockId });
        const blockInfo = rooms.length > 0 ? {
            name: proctor.blockId,
            gender: rooms[0].gender,
            totalRooms: rooms.length,
            totalCapacity: rooms.reduce((sum, r) => sum + r.capacity, 0),
            occupied: rooms.reduce((sum, r) => sum + r.occupants.length, 0)
        } : { name: proctor.blockId };

        // Get report statistics
        const totalReports = await Request.countDocuments({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            blockId: proctor.blockId
        });

        const pendingReports = await Request.countDocuments({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            blockId: proctor.blockId,
            status: 'pending'
        });

        const resolvedReports = await Request.countDocuments({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            blockId: proctor.blockId,
            status: 'resolved'
        });

        const unreadMessages = await Request.countDocuments({
            toUserId: proctor._id,
            toUserModel: 'Proctor',
            blockId: proctor.blockId,
            status: 'pending'
        });

        res.json({
            success: true,
            stats: {
                block: blockInfo,
                totalReports,
                pendingReports,
                resolvedReports,
                unreadMessages
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update proctor profile
// @route   PUT /api/proctor/profile
// @access  Private (Proctor)
const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, email } = req.body;

        const proctor = await Proctor.findById(req.user.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Update allowed fields only
        if (fullName) proctor.fullName = fullName;
        if (phone) proctor.phone = phone;
        if (email) proctor.email = email;

        await proctor.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            proctor: {
                id: proctor._id,
                fullName: proctor.fullName,
                username: proctor.username,
                phone: proctor.phone,
                email: proctor.email,
                blockId: proctor.blockId
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProfile,
    createReport,
    getReports,
    getMessages,
    replyToMessage,
    getStats,
    updateProfile
};
