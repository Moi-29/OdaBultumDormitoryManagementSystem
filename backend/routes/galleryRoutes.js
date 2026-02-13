const express = require('express');
const router = express.Router();
const {
    getGalleryImages,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    bulkDeleteGalleryImages
} = require('../controllers/galleryController');
const { protect, restrictTo } = require('../middleware/multiAuthMiddleware');

// Public route for students to view gallery
router.get('/public', getGalleryImages);

router.route('/')
    .get(protect, restrictTo('admin'), getGalleryImages)
    .post(protect, restrictTo('admin'), addGalleryImage);

router.post('/bulk-delete', protect, restrictTo('admin'), bulkDeleteGalleryImages);

router.route('/:id')
    .put(protect, restrictTo('admin'), updateGalleryImage)
    .delete(protect, restrictTo('admin'), deleteGalleryImage);

module.exports = router;
