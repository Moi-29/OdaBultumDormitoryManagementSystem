const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

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
        console.log('Add gallery image request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);
        
        let imageUrl;
        
        if (req.file) {
            // Image uploaded via multer/cloudinary
            imageUrl = req.file.path;
            console.log('Image uploaded to Cloudinary:', imageUrl);
        } else if (req.body.imageUrl) {
            // Direct URL provided (for backward compatibility)
            imageUrl = req.body.imageUrl;
            console.log('Using provided URL:', imageUrl);
        } else {
            console.log('Error: No image provided');
            return res.status(400).json({ success: false, message: 'No image provided' });
        }
        
        const imageData = {
            imageUrl,
            uploadedBy: req.user?.id,
            uploadedByName: req.user?.username || req.user?.fullName || 'Admin'
        };
        
        console.log('Creating image with data:', imageData);
        const image = await Gallery.create(imageData);
        console.log('Image created successfully:', image._id);
        
        res.status(201).json({
            success: true,
            message: 'Image added successfully',
            image
        });
    } catch (error) {
        console.error('Error adding gallery image:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
const updateGalleryImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        
        let imageUrl = image.imageUrl;
        
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (image.imageUrl.includes('cloudinary.com')) {
                const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting old image:', err));
            }
            imageUrl = req.file.path;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }
        
        image.imageUrl = imageUrl;
        await image.save();
        
        res.json({
            success: true,
            message: 'Image updated successfully',
            image
        });
    } catch (error) {
        console.error('Error updating gallery image:', error);
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
        
        // Delete from Cloudinary if it's a Cloudinary URL
        if (image.imageUrl.includes('cloudinary.com')) {
            const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting from Cloudinary:', err));
        }
        
        console.log(`Deleting image ${req.params.id} from database`);
        await image.deleteOne();
        console.log(`Image ${req.params.id} deleted successfully from database`);
        
        res.json({
            success: true,
            message: 'Image deleted successfully from database'
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
        
        // Get all images to delete from Cloudinary
        const images = await Gallery.find({ _id: { $in: imageIds } });
        
        // Delete from Cloudinary
        for (const image of images) {
            if (image.imageUrl.includes('cloudinary.com')) {
                const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting from Cloudinary:', err));
            }
        }
        
        console.log(`Bulk deleting ${imageIds.length} images from database`);
        const result = await Gallery.deleteMany({ _id: { $in: imageIds } });
        console.log(`Bulk delete completed: ${result.deletedCount} images deleted from database`);
        
        res.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} images from database`,
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
    updateGalleryImage,
    deleteGalleryImage,
    bulkDeleteGalleryImages
};
