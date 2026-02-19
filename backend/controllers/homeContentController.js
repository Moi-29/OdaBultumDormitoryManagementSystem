const asyncHandler = require('express-async-handler');
const HomeContent = require('../models/HomeContent');
const cloudinary = require('../config/cloudinary');

// @desc    Get home content
// @route   GET /api/home-content
// @access  Public
const getHomeContent = asyncHandler(async (req, res) => {
    let content = await HomeContent.findOne();
    
    // If no content exists, create default content
    if (!content) {
        content = await HomeContent.create({
            heroTitle: 'Welcome to Oda Bultum University',
            heroSubtitle: 'Dormitory Management System',
            heroDescription: 'Find your dormitory placement, apply for accommodation, and manage your student housing needs all in one place.',
            heroImage: '/images/hero-bg.jpg',
            leadershipTitle: 'University Leadership',
            leadershipDescription: 'Meet the dedicated leaders guiding Oda Bultum University towards excellence in education and student welfare.',
            leaders: []
        });
    }
    
    res.json(content);
});

// @desc    Update hero section
// @route   PUT /api/home-content/hero
// @access  Private/Admin
const updateHeroSection = asyncHandler(async (req, res) => {
    const { heroTitle, heroSubtitle, heroDescription, heroImage } = req.body;
    
    let content = await HomeContent.findOne();
    
    if (!content) {
        content = await HomeContent.create({});
    }
    
    // Update fields
    if (heroTitle !== undefined) content.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) content.heroSubtitle = heroSubtitle;
    if (heroDescription !== undefined) content.heroDescription = heroDescription;
    
    // Handle image upload if provided
    if (heroImage && heroImage.startsWith('data:image')) {
        // Delete old image from cloudinary if exists
        if (content.heroImagePublicId) {
            try {
                await cloudinary.uploader.destroy(content.heroImagePublicId);
            } catch (error) {
                console.error('Error deleting old hero image:', error);
            }
        }
        
        // Upload new image
        try {
            const uploadResponse = await cloudinary.uploader.upload(heroImage, {
                folder: 'home-content',
                resource_type: 'image'
            });
            
            content.heroImage = uploadResponse.secure_url;
            content.heroImagePublicId = uploadResponse.public_id;
        } catch (error) {
            res.status(400);
            throw new Error('Failed to upload hero image');
        }
    }
    
    await content.save();
    res.json(content);
});

// @desc    Update leadership section
// @route   PUT /api/home-content/leadership
// @access  Private/Admin
const updateLeadershipSection = asyncHandler(async (req, res) => {
    const { leadershipTitle, leadershipDescription } = req.body;
    
    let content = await HomeContent.findOne();
    
    if (!content) {
        content = await HomeContent.create({});
    }
    
    if (leadershipTitle !== undefined) content.leadershipTitle = leadershipTitle;
    if (leadershipDescription !== undefined) content.leadershipDescription = leadershipDescription;
    
    await content.save();
    res.json(content);
});

// @desc    Add leader
// @route   POST /api/home-content/leaders
// @access  Private/Admin
const addLeader = asyncHandler(async (req, res) => {
    const { name, position, description, image, order } = req.body;
    
    if (!name || !position || !description) {
        res.status(400);
        throw new Error('Name, position, and description are required');
    }
    
    let content = await HomeContent.findOne();
    
    if (!content) {
        content = await HomeContent.create({});
    }
    
    const newLeader = {
        name,
        position,
        description,
        image: '',
        order: order || content.leaders.length
    };
    
    // Handle image upload if provided
    if (image && image.startsWith('data:image')) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'leaders',
                resource_type: 'image'
            });
            
            newLeader.image = uploadResponse.secure_url;
            newLeader.imagePublicId = uploadResponse.public_id;
        } catch (error) {
            res.status(400);
            throw new Error('Failed to upload leader image');
        }
    } else if (image) {
        newLeader.image = image;
    }
    
    content.leaders.push(newLeader);
    await content.save();
    
    res.status(201).json(content);
});

// @desc    Update leader
// @route   PUT /api/home-content/leaders/:id
// @access  Private/Admin
const updateLeader = asyncHandler(async (req, res) => {
    const { name, position, description, image, order } = req.body;
    
    let content = await HomeContent.findOne();
    
    if (!content) {
        res.status(404);
        throw new Error('Content not found');
    }
    
    const leader = content.leaders.id(req.params.id);
    
    if (!leader) {
        res.status(404);
        throw new Error('Leader not found');
    }
    
    // Update fields
    if (name !== undefined) leader.name = name;
    if (position !== undefined) leader.position = position;
    if (description !== undefined) leader.description = description;
    if (order !== undefined) leader.order = order;
    
    // Handle image upload if provided
    if (image && image.startsWith('data:image')) {
        // Delete old image from cloudinary if exists
        if (leader.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(leader.imagePublicId);
            } catch (error) {
                console.error('Error deleting old leader image:', error);
            }
        }
        
        // Upload new image
        try {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'leaders',
                resource_type: 'image'
            });
            
            leader.image = uploadResponse.secure_url;
            leader.imagePublicId = uploadResponse.public_id;
        } catch (error) {
            res.status(400);
            throw new Error('Failed to upload leader image');
        }
    }
    
    await content.save();
    res.json(content);
});

// @desc    Delete leader
// @route   DELETE /api/home-content/leaders/:id
// @access  Private/Admin
const deleteLeader = asyncHandler(async (req, res) => {
    let content = await HomeContent.findOne();
    
    if (!content) {
        res.status(404);
        throw new Error('Content not found');
    }
    
    const leader = content.leaders.id(req.params.id);
    
    if (!leader) {
        res.status(404);
        throw new Error('Leader not found');
    }
    
    // Delete image from cloudinary if exists
    if (leader.imagePublicId) {
        try {
            await cloudinary.uploader.destroy(leader.imagePublicId);
        } catch (error) {
            console.error('Error deleting leader image:', error);
        }
    }
    
    leader.deleteOne();
    await content.save();
    
    res.json({ message: 'Leader removed' });
});

module.exports = {
    getHomeContent,
    updateHeroSection,
    updateLeadershipSection,
    addLeader,
    updateLeader,
    deleteLeader
};
