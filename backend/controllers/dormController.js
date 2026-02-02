const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Student = require('../models/Student');

// @desc    Get all rooms
// @route   GET /api/dorms
// @access  Private
const getRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find({}).populate('occupants');
    res.json(rooms);
});

// @desc    Get room by ID
// @route   GET /api/dorms/:id
// @access  Private
const getRoomById = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id).populate('occupants');

    if (room) {
        res.json(room);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

// @desc    Create new room
// @route   POST /api/dorms
// @access  Private/Admin
const createRoom = asyncHandler(async (req, res) => {
    const { building, floor, roomNumber, type, capacity, gender } = req.body;

    const room = await Room.create({
        building,
        floor,
        roomNumber,
        type,
        capacity,
        gender,
        status: 'Available'
    });

    if (room) {
        res.status(201).json(room);
    } else {
        res.status(400);
        throw new Error('Invalid room data');
    }
});

// @desc    Update room
// @route   PUT /api/dorms/:id
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (room) {
        room.building = req.body.building || room.building;
        room.floor = req.body.floor || room.floor;
        room.roomNumber = req.body.roomNumber || room.roomNumber;
        room.type = req.body.type || room.type;
        room.capacity = req.body.capacity || room.capacity;
        room.gender = req.body.gender || room.gender;
        room.status = req.body.status || room.status;

        const updatedRoom = await room.save();
        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

// @desc    Delete room
// @route   DELETE /api/dorms/:id
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);

    if (room) {
        await room.deleteOne();
        res.json({ message: 'Room removed' });
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
});

// @desc    Assign student to room
// @route   POST /api/dorms/:id/assign
// @access  Private/Admin
const assignStudentToRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    const student = await Student.findById(req.body.studentId);

    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check if room is full
    if (room.occupants.length >= room.capacity) {
        res.status(400);
        throw new Error('Room is full');
    }

    // Check gender match
    if (room.gender !== student.gender && room.gender !== 'Co-ed') {
        res.status(400);
        throw new Error('Gender mismatch');
    }

    // Add student to room
    room.occupants.push(student._id);
    if (room.occupants.length >= room.capacity) {
        room.status = 'Full';
    }

    await room.save();

    // Update student's room
    student.room = room._id;
    await student.save();

    res.json({ message: 'Student assigned successfully', room });
});

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    assignStudentToRoom,
};
