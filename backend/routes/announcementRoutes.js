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

router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, createAnnouncement);

router.post('/bulk-delete', protect, bulkDeleteAnnouncements);

router.route('/:id')
    .get(protect, getAnnouncementById)
    .put(protect, updateAnnouncement)
    .delete(protect, deleteAnnouncement);

module.exports = router;
