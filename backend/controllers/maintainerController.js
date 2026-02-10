const Maintainer = require('../models/Maintainer');
const Request = require('../models/Request');

// @desc    Get maintainer profile
// @route   GET /api/maintainer/profile
// @access  Private (Maintainer)
const getProfile = async (req, res) => {
    try {
        const maintainer = await Maintainer.findById(req.user.id).select('-password');
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        res.json({
            success: true,
            maintainer
        });
    } catch (error) {
        console.error('Error fetching maintainer profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a request (maintainer to admin)
// @route   POST /api/maintainer/requests
// @access  Private (Maintainer)
const createRequest = async (req, res) => {
    try {
        const { subject, message, priority, requestType } = req.body;

        // Validation
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Create request
        const request = await Request.create({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer',
            fromUserName: maintainer.fullName,
            toUserModel: 'Admin',
            requestType: requestType || 'Tool Request',
            subject,
            message,
            priority: priority || 'medium',
            status: 'pending',
            submittedOn: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            success: true,
            message: 'Request submitted successfully',
            request
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get maintainer's requests
// @route   GET /api/maintainer/requests
// @access  Private (Maintainer)
const getRequests = async (req, res) => {
    try {
        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Get all requests created by this maintainer
        const requests = await Request.find({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get assigned work orders/reports from admin
// @route   GET /api/maintainer/work-orders
// @access  Private (Maintainer)
const getWorkOrders = async (req, res) => {
    try {
        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Get work orders assigned to this maintainer
        const workOrders = await Request.find({
            toUserId: maintainer._id,
            toUserModel: 'Maintainer'
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: workOrders.length,
            workOrders
        });
    } catch (error) {
        console.error('Error fetching work orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update work order status
// @route   PATCH /api/maintainer/work-orders/:id
// @access  Private (Maintainer)
const updateWorkOrder = async (req, res) => {
    try {
        const { status, response } = req.body;
        const workOrderId = req.params.id;

        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Find and verify work order
        const workOrder = await Request.findOne({
            _id: workOrderId,
            toUserId: maintainer._id,
            toUserModel: 'Maintainer'
        });

        if (!workOrder) {
            return res.status(404).json({ message: 'Work order not found or access denied' });
        }

        // Update work order
        if (status) {
            workOrder.status = status;
            if (status === 'resolved') {
                workOrder.resolvedOn = new Date().toISOString().split('T')[0];
                workOrder.resolvedBy = maintainer._id;
            }
        }
        
        if (response) {
            workOrder.adminResponse = response;
        }

        await workOrder.save();

        res.json({
            success: true,
            message: 'Work order updated successfully',
            workOrder
        });
    } catch (error) {
        console.error('Error updating work order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reply to admin message
// @route   POST /api/maintainer/work-orders/:id/reply
// @access  Private (Maintainer)
const replyToWorkOrder = async (req, res) => {
    try {
        const { message } = req.body;
        const workOrderId = req.params.id;

        if (!message) {
            return res.status(400).json({ message: 'Reply message is required' });
        }

        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Verify the original work order belongs to this maintainer
        const originalWorkOrder = await Request.findOne({
            _id: workOrderId,
            toUserId: maintainer._id,
            toUserModel: 'Maintainer'
        });

        if (!originalWorkOrder) {
            return res.status(404).json({ message: 'Work order not found or access denied' });
        }

        // Create reply as a new request
        const reply = await Request.create({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer',
            fromUserName: maintainer.fullName,
            toUserModel: 'Admin',
            requestType: 'Message',
            subject: `Re: ${originalWorkOrder.subject}`,
            message,
            priority: originalWorkOrder.priority,
            status: 'pending',
            submittedOn: new Date().toISOString().split('T')[0]
        });

        res.status(201).json({
            success: true,
            message: 'Reply sent successfully',
            reply
        });
    } catch (error) {
        console.error('Error replying to work order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get maintainer statistics
// @route   GET /api/maintainer/stats
// @access  Private (Maintainer)
const getStats = async (req, res) => {
    try {
        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Get statistics
        const totalRequests = await Request.countDocuments({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer'
        });

        const pendingRequests = await Request.countDocuments({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer',
            status: 'pending'
        });

        const assignedWorkOrders = await Request.countDocuments({
            toUserId: maintainer._id,
            toUserModel: 'Maintainer'
        });

        const completedWorkOrders = await Request.countDocuments({
            toUserId: maintainer._id,
            toUserModel: 'Maintainer',
            status: 'resolved'
        });

        const pendingWorkOrders = await Request.countDocuments({
            toUserId: maintainer._id,
            toUserModel: 'Maintainer',
            status: { $in: ['pending', 'in-progress'] }
        });

        res.json({
            success: true,
            stats: {
                totalRequests,
                pendingRequests,
                assignedWorkOrders,
                completedWorkOrders,
                pendingWorkOrders
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update maintainer profile
// @route   PUT /api/maintainer/profile
// @access  Private (Maintainer)
const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, email, specialization } = req.body;

        const maintainer = await Maintainer.findById(req.user.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Update allowed fields only
        if (fullName) maintainer.fullName = fullName;
        if (phone) maintainer.phone = phone;
        if (email) maintainer.email = email;
        if (specialization) maintainer.specialization = specialization;

        await maintainer.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            maintainer: {
                id: maintainer._id,
                fullName: maintainer.fullName,
                username: maintainer.username,
                phone: maintainer.phone,
                email: maintainer.email,
                specialization: maintainer.specialization
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getProfile,
    createRequest,
    getRequests,
    getWorkOrders,
    updateWorkOrder,
    replyToWorkOrder,
    getStats,
    updateProfile
};
