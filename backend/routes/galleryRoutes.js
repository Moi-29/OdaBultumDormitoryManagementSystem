const express = require('express');
const router = express.Router();
const {
    getGalleryImages,
    addGalleryImage,
    deleteGalleryImage,
    bulkDeleteGalleryImages
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getGalleryImages)
    .post(protect, addGalleryImage);

router.post('/bulk-delete', protect, bulkDeleteGalleryImages);

router.route('/:id')
    .delete(protect, deleteGalleryImage);

module.exports = router;
