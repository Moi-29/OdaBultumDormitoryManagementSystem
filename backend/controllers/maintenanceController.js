const asyncHandler = require('express-async-handler');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceRequests = asyncHandler(async (req, res) => {
    const requests = await MaintenanceRequest.find({})
        .populate('student')
        .populate('room')
        .populate('assignedTo');
    res.json(requests);
});

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private/Student
const createMaintenanceRequest = asyncHandler(async (req, res) => {
    const { student, room, issueType, description, priority } = req.body;

    const request = await MaintenanceRequest.create({
        student,
        room,
        issueType,
        description,
        priority: priority || 'Low',
        status: 'Pending'
    });

    if (request) {
        res.status(201).json(request);
    } else {
        res.status(400);
        throw new Error('Invalid request data');
    }
});

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private/Admin/Maintenance
const updateMaintenanceRequest = asyncHandler(async (req, res) => {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (request) {
        request.status = req.body.status || request.status;
        request.assignedTo = req.body.assignedTo || request.assignedTo;

        if (req.body.comment) {
            request.updates.push({
                status: req.body.status,
                comment: req.body.comment,
                updatedBy: req.body.updatedBy
            });
        }

        const updatedRequest = await request.save();
        res.json(updatedRequest);
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});

module.exports = {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
};
