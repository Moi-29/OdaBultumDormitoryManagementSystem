const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    // Sender information
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: 'fromUserModel'
    },
    fromUserModel: {
        type: String,
        required: false,
        enum: ['Student', 'Proctor', 'Maintainer', 'Admin'],
        default: 'Student'
    },
    fromUserName: {
        type: String,
        required: false
    },
    
    // Recipient information (usually admin)
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'toUserModel'
    },
    toUserModel: {
        type: String,
        enum: ['Admin', 'Proctor', 'Maintainer'],
        default: 'Admin'
    },
    
    // Legacy fields for student requests
    studentId: {
        type: String
    },
    studentName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    
    // Request details
    requestType: {
        type: String,
        required: true,
        enum: ['Room Change', 'Maintenance', 'Extension', 'Facility Issue', 'Report', 'Message', 'Tool Request', 'Other']
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    
    // Block information (for proctor requests)
    blockId: {
        type: String
    },
    
    // Specialization (for maintainer requests)
    specialization: {
        type: String
    },
    
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'rejected', 'approved'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    currentRoom: {
        type: String
    },
    submittedOn: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    resolvedOn: {
        type: String
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    adminResponse: {
        type: String
    },
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: Date
    }]
}, {
    timestamps: true
});

// Index for efficient queries
requestSchema.index({ fromUserId: 1, status: 1 });
requestSchema.index({ toUserId: 1, status: 1 });
requestSchema.index({ blockId: 1, status: 1 });
requestSchema.index({ requestType: 1, status: 1 });
requestSchema.index({ isRead: 1 });

module.exports = mongoose.model('Request', requestSchema);
