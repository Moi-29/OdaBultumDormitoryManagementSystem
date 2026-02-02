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

// @desc    Auto-allocate students to dorms
// @route   POST /api/dorms/allocate
// @access  Private/Admin
const autoAllocate = asyncHandler(async (req, res) => {
    // Get all unassigned students
    const unassignedStudents = await Student.find({ room: null });

    if (unassignedStudents.length === 0) {
        return res.json({
            success: true,
            message: 'No unassigned students found',
            allocated: 0
        });
    }

    // Separate students by gender
    const maleStudents = unassignedStudents.filter(s => s.gender === 'M');
    const femaleStudents = unassignedStudents.filter(s => s.gender === 'F');

    // Sort function based on year
    const sortStudents = (students) => {
        const freshmen = students.filter(s => s.year === 1);
        const seniors = students.filter(s => s.year > 1);

        // Fresh students: Sort alphabetically only
        freshmen.sort((a, b) => a.fullName.localeCompare(b.fullName));

        // Senior students: Sort by department, then alphabetically
        seniors.sort((a, b) => {
            if (a.department !== b.department) {
                return a.department.localeCompare(b.department);
            }
            return a.fullName.localeCompare(b.fullName);
        });

        // Combine: seniors first, then freshmen
        return [...seniors, ...freshmen];
    };

    const sortedMaleStudents = sortStudents(maleStudents);
    const sortedFemaleStudents = sortStudents(femaleStudents);

    // Get available rooms
    const maleRooms = await Room.find({
        gender: 'M',
        status: { $ne: 'Under Maintenance' }
    }).sort({ building: 1, floor: 1, roomNumber: 1 });

    const femaleRooms = await Room.find({
        gender: 'F',
        status: { $ne: 'Under Maintenance' }
    }).sort({ building: 1, floor: 1, roomNumber: 1 });

    let allocatedCount = 0;
    const allocationDetails = [];

    // Allocation function
    const allocateToRooms = async (students, rooms) => {
        let studentIndex = 0;

        for (const room of rooms) {
            const availableSpace = room.capacity - room.occupants.length;

            if (availableSpace > 0 && studentIndex < students.length) {
                const studentsToAssign = students.slice(studentIndex, studentIndex + availableSpace);

                for (const student of studentsToAssign) {
                    room.occupants.push(student._id);
                    student.room = room._id;
                    await student.save();
                    allocatedCount++;

                    allocationDetails.push({
                        studentId: student.studentId,
                        fullName: student.fullName,
                        room: `${room.building}-${room.roomNumber}`,
                        year: student.year,
                        department: student.department
                    });
                }

                if (room.occupants.length >= room.capacity) {
                    room.status = 'Full';
                } else {
                    room.status = 'Available';
                }

                await room.save();
                studentIndex += studentsToAssign.length;
            }

            if (studentIndex >= students.length) break;
        }

        return studentIndex;
    };

    // Allocate male and female students
    const malesAllocated = await allocateToRooms(sortedMaleStudents, maleRooms);
    const femalesAllocated = await allocateToRooms(sortedFemaleStudents, femaleRooms);

    const unallocatedMales = sortedMaleStudents.length - malesAllocated;
    const unallocatedFemales = sortedFemaleStudents.length - femalesAllocated;

    res.json({
        success: true,
        message: `Successfully allocated ${allocatedCount} students`,
        allocated: allocatedCount,
        unallocated: unallocatedMales + unallocatedFemales,
        details: {
            malesAllocated,
            femalesAllocated,
            unallocatedMales,
            unallocatedFemales,
            allocations: allocationDetails
        }
    });
});

// @desc    Get system-wide statistics for manager
// @route   GET /api/dorms/statistics
// @access  Private/Manager
const getStatistics = asyncHandler(async (req, res) => {
    const Student = require('../models/Student');
    const MaintenanceRequest = require('../models/MaintenanceRequest');

    // Room statistics
    const totalRooms = await Room.countDocuments();
    const fullRooms = await Room.countDocuments({ status: 'Full' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Under Maintenance' });

    // Student statistics
    const totalStudents = await Student.countDocuments();
    const assignedStudents = await Student.countDocuments({ room: { $ne: null } });
    const unassignedStudents = totalStudents - assignedStudents;

    // Maintenance statistics
    const pendingMaintenance = await MaintenanceRequest.countDocuments({ status: 'Pending' });
    const inProgressMaintenance = await MaintenanceRequest.countDocuments({ status: 'In Progress' });
    const completedMaintenance = await MaintenanceRequest.countDocuments({ status: 'Completed' });

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0 ? Math.round((fullRooms / totalRooms) * 100) : 0;

    res.json({
        rooms: {
            total: totalRooms,
            full: fullRooms,
            available: availableRooms,
            maintenance: maintenanceRooms,
            occupancyRate
        },
        students: {
            total: totalStudents,
            assigned: assignedStudents,
            unassigned: unassignedStudents
        },
        maintenance: {
            pending: pendingMaintenance,
            inProgress: inProgressMaintenance,
            completed: completedMaintenance,
            total: pendingMaintenance + inProgressMaintenance + completedMaintenance
        }
    });
});

module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    assignStudentToRoom,
    autoAllocate,
    getStatistics,
};
