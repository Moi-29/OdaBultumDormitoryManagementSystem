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

// Public route for students to view gallery
router.get('/public', getGalleryImages);

router.route('/')
    .get(protect, getGalleryImages)
    .post(protect, addGalleryImage);

router.post('/bulk-delete', protect, bulkDeleteGalleryImages);

router.route('/:id')
    .put(protect, updateGalleryImage)
    .delete(protect, deleteGalleryImage);

module.exports = router;
