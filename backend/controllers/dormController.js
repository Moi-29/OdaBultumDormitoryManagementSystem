const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Student = require('../models/Student');
const SystemSettings = require('../models/SystemSettings');

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
    console.log('📝 Creating room with data:', req.body);
    
    let { building, block, floor, roomNumber, type, capacity, gender } = req.body;

    // Validate required fields
    if (!building || !roomNumber || !floor || !gender) {
        console.error('❌ Missing required fields:', { building, roomNumber, floor, gender });
        res.status(400);
        throw new Error('Building, room number, floor, and gender are required');
    }

    // If capacity is not provided, use system default
    if (!capacity) {
        const settings = await SystemSettings.findOne();
        capacity = settings?.maxStudentsPerRoom || 4;
    }

    try {
        const room = await Room.create({
            building,
            block,
            floor,
            roomNumber,
            type,
            capacity,
            gender,
            status: 'Available'
        });

        console.log('✅ Room created successfully:', room._id);
        res.status(201).json(room);
    } catch (error) {
        console.error('❌ Error creating room:', error.message);
        if (error.code === 11000) {
            res.status(400);
            throw new Error(`Room ${roomNumber} already exists in ${building}`);
        }
        throw error;
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

    // Check if student is already in a room
    if (student.room) {
        if (student.room.toString() === room._id.toString()) {
            res.status(400);
            throw new Error('Student is already in this room');
        }

        // Remove from old room
        const oldRoom = await Room.findById(student.room);
        if (oldRoom) {
            oldRoom.occupants = oldRoom.occupants.filter(id => id.toString() !== student._id.toString());
            // Update status if it was full
            if (oldRoom.occupants.length < oldRoom.capacity && oldRoom.status === 'Full') {
                oldRoom.status = 'Available';
            }
            await oldRoom.save();
        }
    }

    // Add student to new room
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

// @desc    Remove student from room
// @route   POST /api/dorms/:id/remove
// @access  Private/Admin
const removeStudentFromRoom = asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.id);
    const { studentId } = req.body;

    // Find student (optional verification)
    const Student = require('../models/Student');
    const student = await Student.findById(studentId);

    if (!room) {
        res.status(404);
        throw new Error('Room not found');
    }

    // Remove student from room occupants
    const initialLength = room.occupants.length;
    room.occupants = room.occupants.filter(id => id.toString() !== studentId);

    if (room.occupants.length === initialLength) {
        res.status(400);
        throw new Error('Student not found in this room');
    }

    // Update status
    if (room.occupants.length < room.capacity) {
        room.status = 'Available';
    }

    await room.save();

    // Update student record if found
    if (student) {
        student.room = null;
        await student.save();
    }

    res.json({ message: 'Student removed from room', room });
});

// @desc    Auto-allocate students to dorms
// @route   POST /api/dorms/allocate
// @access  Private/Admin
// @desc    Auto-allocate students to dorms (with optional filters)
// @route   POST /api/dorms/allocate
// @access  Private/Admin
const autoAllocate = asyncHandler(async (req, res) => {
    console.log('🎯 Allocate endpoint hit!', req.body);
    const { criteria, targetBuilding, targetBlock } = req.body; // Add targetBlock

    // 1. Build Student Query
    const studentQuery = { room: null };
    if (criteria?.department) studentQuery.department = criteria.department;
    if (criteria?.year) studentQuery.year = parseInt(criteria.year);
    if (criteria?.gender) studentQuery.gender = criteria.gender;

    // Get unassigned students matching filters
    let unassignedStudents = await Student.find(studentQuery);

    if (unassignedStudents.length === 0) {
        return res.json({
            success: true,
            message: 'No matching unassigned students found',
            allocated: 0,
            details: { malesAllocated: 0, femalesAllocated: 0, unallocated: 0 }
        });
    }

    // 2. Build Room Query
    const roomQuery = { status: { $ne: 'Under Maintenance' } };
    if (targetBuilding) roomQuery.building = targetBuilding;
    if (targetBlock) roomQuery.block = targetBlock; // Add block filter

    // 3. Separate and Sort Students
    const maleStudents = unassignedStudents.filter(s => s.gender === 'M');
    const femaleStudents = unassignedStudents.filter(s => s.gender === 'F');

    // Sort function (Seniors > Freshmen, Department grouping)
    const sortStudents = (students) => {
        const freshmen = students.filter(s => s.year === 1);
        const seniors = students.filter(s => s.year > 1);

        freshmen.sort((a, b) => a.fullName.localeCompare(b.fullName));
        seniors.sort((a, b) => {
            if (a.department !== b.department) return a.department.localeCompare(b.department);
            return a.fullName.localeCompare(b.fullName);
        });

        return [...seniors, ...freshmen];
    };

    const sortedMaleStudents = sortStudents(maleStudents);
    const sortedFemaleStudents = sortStudents(femaleStudents);

    // 4. Fetch Available Rooms with current occupants
    // We need separate queries for M and F to respect building choices + gender constraints
    const maleRoomQuery = { ...roomQuery, gender: 'M' };
    const femaleRoomQuery = { ...roomQuery, gender: 'F' };

    // Populate occupants to get accurate count
    const maleRooms = await Room.find(maleRoomQuery).populate('occupants');
    const femaleRooms = await Room.find(femaleRoomQuery).populate('occupants');

    // Sort rooms properly: building → block → room number (numeric)
    const sortRoomsByOrder = (rooms) => {
        return rooms.sort((a, b) => {
            // Sort by building first
            const buildingCompare = (a.building || '').localeCompare(b.building || '');
            if (buildingCompare !== 0) return buildingCompare;
            
            // Sort by block second
            const blockCompare = (a.block || '').localeCompare(b.block || '');
            if (blockCompare !== 0) return blockCompare;
            
            // Sort by room number (convert to number for proper numeric sorting)
            const roomA = parseInt(a.roomNumber) || 0;
            const roomB = parseInt(b.roomNumber) || 0;
            return roomA - roomB;
        });
    };

    const sortedMaleRooms = sortRoomsByOrder(maleRooms);
    const sortedFemaleRooms = sortRoomsByOrder(femaleRooms);

    console.log('🏠 Male rooms order:', sortedMaleRooms.map(r => `${r.building}-${r.roomNumber} (${r.occupants.length}/${r.capacity})`));
    console.log('🏠 Female rooms order:', sortedFemaleRooms.map(r => `${r.building}-${r.roomNumber} (${r.occupants.length}/${r.capacity})`));

    let allocatedCount = 0;
    const allocationDetails = [];

    // Allocation logic - Fill each room completely before moving to next
    const allocateToRooms = async (students, rooms) => {
        let studentIndex = 0;
        let assignedInThisRun = 0;

        console.log(`\n📋 Starting allocation for ${students.length} students across ${rooms.length} rooms`);

        for (let i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            
            // Calculate available space in this room
            const currentOccupants = room.occupants ? room.occupants.length : 0;
            const availableSpace = room.capacity - currentOccupants;

            console.log(`\n🏠 Room ${i + 1}: ${room.building}-${room.roomNumber} | Capacity: ${room.capacity} | Current: ${currentOccupants} | Available: ${availableSpace}`);

            // Skip if room is full
            if (availableSpace <= 0) {
                console.log(`   ⏭️  Room is full, skipping...`);
                continue;
            }

            // Skip if no more students to assign
            if (studentIndex >= students.length) {
                console.log(`   ✅ All students allocated, stopping...`);
                break;
            }

            // Get students to fill this room completely (or as many as available)
            const studentsToAssign = students.slice(studentIndex, studentIndex + availableSpace);
            console.log(`   👥 Assigning ${studentsToAssign.length} students to this room`);

            // Assign all students to this room
            for (const student of studentsToAssign) {
                room.occupants.push(student._id);
                student.room = room._id;
                await student.save();
                allocatedCount++;
                assignedInThisRun++;

                console.log(`      ✓ ${student.studentId} - ${student.fullName}`);

                allocationDetails.push({
                    studentId: student.studentId,
                    fullName: student.fullName,
                    room: `${room.building}-${room.roomNumber}`,
                    year: student.year,
                    department: student.department
                });
            }

            // Update room status based on occupancy
            if (room.occupants.length >= room.capacity) {
                room.status = 'Full';
                console.log(`   🔒 Room is now FULL (${room.occupants.length}/${room.capacity})`);
            } else {
                room.status = 'Available';
                console.log(`   🔓 Room still available (${room.occupants.length}/${room.capacity})`);
            }

            await room.save();
            studentIndex += studentsToAssign.length;
        }

        console.log(`\n✅ Allocation complete: ${assignedInThisRun} students assigned\n`);
        return assignedInThisRun;
    };

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

// @desc    Get system-wide statistics
// @route   GET /api/dorms/statistics
// @access  Private/Admin
const getStatistics = asyncHandler(async (req, res) => {
    const Student = require('../models/Student');

    // Room statistics
    const totalRooms = await Room.countDocuments();
    const fullRooms = await Room.countDocuments({ status: 'Full' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Under Maintenance' });

    // Student statistics
    const totalStudents = await Student.countDocuments();
    const assignedStudents = await Student.countDocuments({ room: { $ne: null } });
    const unassignedStudents = totalStudents - assignedStudents;

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
    removeStudentFromRoom,
    autoAllocate,
    getStatistics,
};
