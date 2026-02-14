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
    imageUrl: {
        type: String,
        trim: true
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

// ⚡ PERFORMANCE INDEXES - Optimized for sub-second queries
announcementSchema.index({ status: 1, createdAt: -1 }); // Primary query pattern
announcementSchema.index({ type: 1, status: 1, createdAt: -1 }); // Type filtering
announcementSchema.index({ targetAudience: 1, status: 1, createdAt: -1 }); // Audience filtering
announcementSchema.index({ priority: 1, status: 1, createdAt: -1 }); // Priority sorting
announcementSchema.index({ publishedAt: -1 }); // Published date sorting
announcementSchema.index({ expiresAt: 1 }); // Expiry checking
announcementSchema.index({ status: 1, publishedAt: -1, priority: -1 }); // Compound for home page

module.exports = mongoose.model('Announcement', announcementSchema);
