const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    // Student information
    studentId: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    date: {
        type: Date,
        required: true
    },
    
    // Permission details
    purpose: {
        type: String,
        default: 'Religious Purpose'
    },
    returnTime: {
        type: String,
        default: '9:00 PM'
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    // Admin response
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    approvedAt: {
        type: Date
    },
    adminNotes: {
        type: String
    },
    
    // User reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }
}, {
    timestamps: true
});

// Index for efficient queries
permissionSchema.index({ studentId: 1, status: 1 });
permissionSchema.index({ date: 1 });
permissionSchema.index({ status: 1 });

module.exports = mongoose.model('Permission', permissionSchema);
