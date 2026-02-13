const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['announcement', 'event'],
        default: 'announcement'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    targetAudience: {
        type: [String],
        enum: ['all', 'students', 'proctors', 'maintainers', 'admins'],
        default: ['all']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    eventDate: {
        type: Date
    },
    eventLocation: {
        type: String
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    publishedByName: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
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
announcementSchema.index({ status: 1, createdAt: -1 });
announcementSchema.index({ type: 1, status: 1 });
announcementSchema.index({ targetAudience: 1, status: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
