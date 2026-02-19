const mongoose = require('mongoose');

const homeContentSchema = mongoose.Schema({
    // Hero Section
    heroTitle: {
        type: String,
        default: 'Welcome to Oda Bultum University'
    },
    heroSubtitle: {
        type: String,
        default: 'Dormitory Management System'
    },
    heroDescription: {
        type: String,
        default: 'Find your dormitory placement, apply for accommodation, and manage your student housing needs all in one place.'
    },
    heroImage: {
        type: String,
        default: '/images/hero-bg.jpg'
    },
    heroImagePublicId: {
        type: String,
        default: null
    },
    
    // Leadership Section
    leadershipTitle: {
        type: String,
        default: 'University Leadership'
    },
    leadershipDescription: {
        type: String,
        default: 'Meet the dedicated leaders guiding Oda Bultum University towards excellence in education and student welfare.'
    },
    
    // Leadership Members (array of leaders)
    leaders: [{
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        imagePublicId: {
            type: String,
            default: null
        },
        order: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);
module.exports = HomeContent;
