const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    uploadedByName: {
        type: String
    }
}, {
    timestamps: true
});

// ⚡ PERFORMANCE INDEXES - Optimized for gallery loading
gallerySchema.index({ createdAt: -1 }); // Primary sort order
gallerySchema.index({ uploadedBy: 1, createdAt: -1 }); // Filter by uploader

module.exports = mongoose.model('Gallery', gallerySchema);
