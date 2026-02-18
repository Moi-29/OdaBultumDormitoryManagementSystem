const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, assignStudentToRoom, autoAllocate, getStatistics } = require('../controllers/dormController');

// Log all requests to this router
router.use((req, res, next) => {
    console.log(`🔵 Dorm Route: ${req.method} ${req.path}`);
    next();
});

router.route('/').get(getRooms).post(createRoom);
router.route('/allocate').post(autoAllocate);
router.route('/statistics').get(getStatistics);
router.route('/:id').get(getRoomById).put(updateRoom).delete(deleteRoom);
router.route('/:id/assign').post(assignStudentToRoom);
router.route('/:id/remove').post(require('../controllers/dormController').removeStudentFromRoom);

module.exports = router;
