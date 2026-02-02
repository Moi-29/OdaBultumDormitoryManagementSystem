const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, assignStudentToRoom, autoAllocate, getStatistics } = require('../controllers/dormController');

router.route('/').get(getRooms).post(createRoom);
router.route('/allocate').post(autoAllocate);
router.route('/statistics').get(getStatistics);
router.route('/:id').get(getRoomById).put(updateRoom).delete(deleteRoom);
router.route('/:id/assign').post(assignStudentToRoom);

module.exports = router;
