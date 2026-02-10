const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: true,
        enum: ['Room Change', 'Maintenance', 'Extension', 'Facility Issue', 'Other']
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
