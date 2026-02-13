const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Private
const getGalleryImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: images.length,
            images
        });
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Add image to gallery
// @route   POST /api/gallery
// @access  Private (Admin)
const addGalleryImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image URL is required' });
        }
        
        const imageData = {
            imageUrl,
            uploadedBy: req.user?.id,
            uploadedByName: req.user?.username || 'Admin'
        };
        
        const image = await Gallery.create(imageData);
        
        res.status(201).json({
            success: true,
            message: 'Image added successfully',
            image
        });
    } catch (error) {
        console.error('Error adding gallery image:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        
        await image.deleteOne();
        
        res.json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Bulk delete gallery images
// @route   POST /api/gallery/bulk-delete
// @access  Private (Admin)
const bulkDeleteGalleryImages = async (req, res) => {
    try {
        const { imageIds } = req.body;
        
        if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Image IDs array is required' });
        }
        
        const result = await Gallery.deleteMany({ _id: { $in: imageIds } });
        
        res.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} images`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error bulk deleting gallery images:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getGalleryImages,
    addGalleryImage,
    deleteGalleryImage,
    bulkDeleteGalleryImages
};
