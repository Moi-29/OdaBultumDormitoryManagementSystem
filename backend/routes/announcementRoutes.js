const express = require('express');
const router = express.Router();
const {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    bulkDeleteAnnouncements
} = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');
const { uploadNews } = require('../middleware/upload');

// Public route for students to view announcements
router.get('/public', getAnnouncements);

router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, uploadNews.single('image'), createAnnouncement);

router.post('/bulk-delete', protect, bulkDeleteAnnouncements);

router.route('/:id')
    .get(protect, getAnnouncementById)
    .put(protect, uploadNews.single('image'), updateAnnouncement)
    .delete(protect, deleteAnnouncement);

module.exports = router;
