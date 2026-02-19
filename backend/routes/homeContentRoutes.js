const express = require('express');
const router = express.Router();
const {
    getHomeContent,
    updateHeroSection,
    updateLeadershipSection,
    addLeader,
    updateLeader,
    deleteLeader
} = require('../controllers/homeContentController');

// Public route
router.route('/').get(getHomeContent);

// Admin routes (add authentication middleware as needed)
router.route('/hero').put(updateHeroSection);
router.route('/leadership').put(updateLeadershipSection);
router.route('/leaders').post(addLeader);
router.route('/leaders/:id').put(updateLeader).delete(deleteLeader);

module.exports = router;
