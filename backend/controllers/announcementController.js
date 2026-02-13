const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const { status, type, targetAudience } = req.query;
        
        let query = {};
        
        if (status) query.status = status;
        if (type) query.type = type;
        if (targetAudience) query.targetAudience = { $in: [targetAudience, 'all'] };
        
        const announcements = await Announcement.find(query).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: announcements.length,
            announcements
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        
        res.json({
            success: true,
            announcement
        });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Admin)
const createAnnouncement = async (req, res) => {
    try {
        const {
            title,
            content,
            imageUrl,
            type,
            priority,
            targetAudience,
            status,
            eventDate,
            eventLocation,
            expiresAt
        } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }
        
        const announcementData = {
            title,
            content,
            type: type || 'announcement',
            priority: priority || 'medium',
            targetAudience: targetAudience || ['all'],
            status: status || 'draft',
            publishedBy: req.user?.id,
            publishedByName: req.user?.username || 'Admin'
        };
        
        if (imageUrl) announcementData.imageUrl = imageUrl;
        if (eventDate) announcementData.eventDate = eventDate;
        if (eventLocation) announcementData.eventLocation = eventLocation;
        if (expiresAt) announcementData.expiresAt = expiresAt;
        
        if (status === 'published') {
            announcementData.publishedAt = new Date();
        }
        
        const announcement = await Announcement.create(announcementData);
        
        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            announcement
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin)
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        
        const {
            title,
            content,
            imageUrl,
            type,
            priority,
            targetAudience,
            status,
            eventDate,
            eventLocation,
            expiresAt
        } = req.body;
        
        if (title) announcement.title = title;
        if (content) announcement.content = content;
        if (imageUrl !== undefined) announcement.imageUrl = imageUrl;
        if (type) announcement.type = type;
        if (priority) announcement.priority = priority;
        if (targetAudience) announcement.targetAudience = targetAudience;
        if (eventDate !== undefined) announcement.eventDate = eventDate;
        if (eventLocation !== undefined) announcement.eventLocation = eventLocation;
        if (expiresAt !== undefined) announcement.expiresAt = expiresAt;
        
        // If changing to published status, set publishedAt
        if (status && status === 'published' && announcement.status !== 'published') {
            announcement.publishedAt = new Date();
        }
        
        if (status) announcement.status = status;
        
        await announcement.save();
        
        res.json({
            success: true,
            message: 'Announcement updated successfully',
            announcement
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        
        await announcement.deleteOne();
        
        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Bulk delete announcements
// @route   POST /api/announcements/bulk-delete
// @access  Private (Admin)
const bulkDeleteAnnouncements = async (req, res) => {
    try {
        const { announcementIds } = req.body;
        
        if (!announcementIds || !Array.isArray(announcementIds) || announcementIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Announcement IDs array is required' });
        }
        
        const result = await Announcement.deleteMany({ _id: { $in: announcementIds } });
        
        res.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} announcements`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error bulk deleting announcements:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    bulkDeleteAnnouncements
};
