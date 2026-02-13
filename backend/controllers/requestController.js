const Request = require('../models/Request');
const Message = require('../models/Message');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin)
const getRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ createdAt: -1 });
        
        // Ensure isRead field exists for all requests (for backward compatibility)
        const requestsWithIsRead = requests.map(req => {
            const reqObj = req.toObject();
            if (reqObj.isRead === undefined || reqObj.isRead === null) {
                reqObj.isRead = false;
            }
            return reqObj;
        });
        
        res.json(requestsWithIsRead);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Public
const createRequest = async (req, res) => {
    try {
        const {
            fromUserId,
            fromUserModel,
            fromUserName,
            toUserId,
            toUserModel,
            studentId,
            studentName,
            email,
            phone,
            requestType,
            subject,
            message,
            status,
            priority,
            currentRoom,
            submittedOn,
            blockId,
            specialization
        } = req.body;

        // Validate required fields
        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const request = await Request.create({
            fromUserId: fromUserId || null,
            fromUserModel: fromUserModel || 'Student',
            fromUserName: fromUserName || studentName || 'Unknown',
            toUserId: toUserId || null,
            toUserModel: toUserModel || 'Admin',
            studentId,
            studentName,
            email,
            phone,
            blockId,
            specialization,
            requestType,
            subject,
            message,
            status: status || 'pending',
            priority: priority || 'medium',
            currentRoom,
            submittedOn: submittedOn || new Date().toISOString().split('T')[0]
        });

        res.status(201).json(request);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        if (status !== 'pending') {
            request.resolvedOn = new Date().toISOString().split('T')[0];
        } else {
            request.resolvedOn = null;
        }

        await request.save();
        res.json(request);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin)
const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Delete all messages associated with this request
        await Message.deleteMany({ requestId: req.params.id });
        
        // Delete the request
        await request.deleteOne();
        
        res.json({ 
            message: 'Request and associated messages deleted successfully',
            deletedRequestId: req.params.id
        });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Bulk delete requests
// @route   POST /api/requests/bulk-delete
// @access  Private (Admin)
const bulkDeleteRequests = async (req, res) => {
    try {
        const { requestIds } = req.body;
        
        if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
            return res.status(400).json({ message: 'Request IDs array is required' });
        }

        // Delete all messages associated with these requests
        await Message.deleteMany({ requestId: { $in: requestIds } });
        
        // Delete all requests
        const result = await Request.deleteMany({ _id: { $in: requestIds } });
        
        res.json({ 
            message: `Successfully deleted ${result.deletedCount} requests and their associated messages`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error bulk deleting requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark request as read
// @route   PATCH /api/requests/:id/read
// @access  Private
const markRequestAsRead = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        request.isRead = true;
        await request.save();
        
        res.json({ success: true, message: 'Request marked as read', request });
    } catch (error) {
        console.error('Error marking request as read:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getRequests,
    createRequest,
    updateRequestStatus,
    deleteRequest,
    bulkDeleteRequests,
    markRequestAsRead
};
