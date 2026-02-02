const mongoose = require('mongoose');

const maintenanceRequestSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    issueType: {
        type: String,
        enum: ['Electrical', 'Plumbing', 'Furniture', 'Civil', 'Other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Emergency'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Maintenance staff
    },
    updates: [{
        status: String,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
module.exports = MaintenanceRequest;
