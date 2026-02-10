const express = require('express');
const router = express.Router();
const {
    // Proctor management
    createProctor,
    getProctors,
    getProctor,
    updateProctor,
    deleteProctor,
    
    // Maintainer management
    createMaintainer,
    getMaintainers,
    getMaintainer,
    updateMaintainer,
    deleteMaintainer,
    
    // Block management
    getBlocks,
    createBlock
} = require('../controllers/userManagementController');
const { protect, restrictTo } = require('../middleware/multiAuthMiddleware');

// All routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

// Proctor routes
router.route('/proctors')
    .get(getProctors)
    .post(createProctor);

router.route('/proctors/:id')
    .get(getProctor)
    .put(updateProctor)
    .delete(deleteProctor);

// Maintainer routes
router.route('/maintainers')
    .get(getMaintainers)
    .post(createMaintainer);

router.route('/maintainers/:id')
    .get(getMaintainer)
    .put(updateMaintainer)
    .delete(deleteMaintainer);

// Block routes
router.route('/blocks')
    .get(getBlocks)
    .post(createBlock);

module.exports = router;
