const Announcement = require('../models/Announcement');
const cloudinary = require('../config/cloudinary');
const cache = require('../utils/cache'); // ⚡ PERFORMANCE: Redis caching

// ⚡ PERFORMANCE: Cache TTL configurations
const CACHE_TTL = {
    ANNOUNCEMENTS_LIST: 300, // 5 minutes
    ANNOUNCEMENT_DETAIL: 600  // 10 minutes
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const { status, type, targetAudience, page = 1, limit = 20 } = req.query;
        
        // ⚡ PERFORMANCE: Generate cache key based on query params
        const cacheKey = `announcements:list:${status || 'all'}:${type || 'all'}:${targetAudience || 'all'}:${page}:${limit}`;
        
        // ⚡ PERFORMANCE: Check cache first
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
            console.log(`✅ Cache HIT: ${cacheKey}`);
            return res.json(cachedData);
        }
        
        console.log(`❌ Cache MISS: ${cacheKey}`);
        
        let query = {};
        
        if (status) query.status = status;
        if (type) query.type = type;
        if (targetAudience) query.targetAudience = { $in: [targetAudience, 'all'] };
        
        // ⚡ PERFORMANCE: Use lean() for read-only queries (30-50% faster)
        // ⚡ PERFORMANCE: Add pagination to limit data transfer
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [announcements, total] = await Promise.all([
            Announcement.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select('-__v') // ⚡ PERFORMANCE: Exclude unnecessary fields
                .lean(), // ⚡ PERFORMANCE: Return plain JS objects (faster)
            Announcement.countDocuments(query)
        ]);
        
        const response = {
            success: true,
            count: announcements.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            announcements
        };
        
        // ⚡ PERFORMANCE: Cache the response
        await cache.set(cacheKey, response, CACHE_TTL.ANNOUNCEMENTS_LIST);
        
        res.json(response);
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
        // ⚡ PERFORMANCE: Cache individual announcements
        const cacheKey = `announcement:${req.params.id}`;
        const cachedData = await cache.get(cacheKey);
        
        if (cachedData) {
            console.log(`✅ Cache HIT: ${cacheKey}`);
            return res.json(cachedData);
        }
        
        // ⚡ PERFORMANCE: Use lean() for read-only query
        const announcement = await Announcement.findById(req.params.id)
            .select('-__v')
            .lean();
        
        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }
        
        const response = {
            success: true,
            announcement
        };
        
        // ⚡ PERFORMANCE: Cache the response
        await cache.set(cacheKey, response, CACHE_TTL.ANNOUNCEMENT_DETAIL);
        
        res.json(response);
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
        
        let imageUrl = null;
        
        if (req.file) {
            // Image uploaded via multer/cloudinary
            imageUrl = req.file.path;
        } else if (req.body.imageUrl) {
            // Direct URL provided (for backward compatibility)
            imageUrl = req.body.imageUrl;
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
        
        // ⚡ PERFORMANCE: Invalidate cache after creating announcement
        await cache.delPattern('announcements:*');
        
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
            type,
            priority,
            targetAudience,
            status,
            eventDate,
            eventLocation,
            expiresAt
        } = req.body;
        
        let imageUrl = announcement.imageUrl;
        
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (announcement.imageUrl && announcement.imageUrl.includes('cloudinary.com')) {
                const publicId = announcement.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting old image:', err));
            }
            imageUrl = req.file.path;
        } else if (req.body.imageUrl !== undefined) {
            imageUrl = req.body.imageUrl;
        }
        
        if (title) announcement.title = title;
        if (content) announcement.content = content;
        announcement.imageUrl = imageUrl;
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
        
        // ⚡ PERFORMANCE: Invalidate cache after updating announcement
        await cache.delPattern('announcements:*');
        await cache.del(`announcement:${req.params.id}`);
        
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
        
        // Delete from Cloudinary if it's a Cloudinary URL
        if (announcement.imageUrl && announcement.imageUrl.includes('cloudinary.com')) {
            const publicId = announcement.imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting from Cloudinary:', err));
        }
        
        await announcement.deleteOne();
        
        // ⚡ PERFORMANCE: Invalidate cache after deleting announcement
        await cache.delPattern('announcements:*');
        await cache.del(`announcement:${req.params.id}`);
        
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
        
        // Get all announcements to delete from Cloudinary
        const announcements = await Announcement.find({ _id: { $in: announcementIds } });
        
        // Delete from Cloudinary
        for (const announcement of announcements) {
            if (announcement.imageUrl && announcement.imageUrl.includes('cloudinary.com')) {
                const publicId = announcement.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId).catch(err => console.log('Error deleting from Cloudinary:', err));
            }
        }
        
        const result = await Announcement.deleteMany({ _id: { $in: announcementIds } });
        
        // ⚡ PERFORMANCE: Invalidate cache after bulk delete
        await cache.delPattern('announcements:*');
        for (const id of announcementIds) {
            await cache.del(`announcement:${id}`);
        }
        
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
