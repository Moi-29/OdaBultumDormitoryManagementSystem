const express = require('express');
const router = express.Router();
const {
    getGalleryImages,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    bulkDeleteGalleryImages
} = require('../controllers/galleryController');
const { protect } = require('../middleware/multiAuthMiddleware');
const { uploadGallery } = require('../middleware/upload');

// Public route for students to view gallery
router.get('/public', getGalleryImages);

router.route('/')
    .get(protect, getGalleryImages)
    .post(protect, uploadGallery.single('image'), addGalleryImage);

router.post('/bulk-delete', protect, bulkDeleteGalleryImages);

router.route('/:id')
    .put(protect, uploadGallery.single('image'), updateGalleryImage)
    .delete(protect, deleteGalleryImage);

module.exports = router;
