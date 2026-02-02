const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const checkData = async () => {
    try {
        console.log('\n📊 DATABASE CONTENTS:\n');
        console.log('='.repeat(60));

        // Check Users
        const users = await User.find({}).select('-password');
        console.log('\n👥 USERS:');
        console.log('-'.repeat(60));
        users.forEach(user => {
            console.log(`   ✓ ${user.username.padEnd(15)} | Role: ${user.role.padEnd(12)} | ${user.email}`);
        });

        // Check Students
        const students = await Student.find({}).populate('room');
        console.log(`\n🎓 STUDENTS (${students.length} total):`);
        console.log('-'.repeat(60));
        students.forEach(student => {
            const roomInfo = student.room ? `${student.room.building}-${student.room.roomNumber}` : 'Not Assigned';
            console.log(`   ✓ ${student.studentId.padEnd(15)} | ${student.fullName.padEnd(20)} | Room: ${roomInfo}`);
        });

        // Check Rooms
        const rooms = await Room.find({}).populate('occupants');
        console.log(`\n🏠 ROOMS (${rooms.length} total):`);
        console.log('-'.repeat(60));
        rooms.forEach(room => {
            console.log(`   ✓ ${room.building}-${room.roomNumber.padEnd(10)} | Occupancy: ${room.occupants.length}/${room.capacity} | Status: ${room.status}`);
        });

        // Check Maintenance Requests
        const requests = await MaintenanceRequest.find({}).populate('student room');
        console.log(`\n🔧 MAINTENANCE REQUESTS (${requests.length} total):`);
        console.log('-'.repeat(60));
        requests.forEach(req => {
            const studentName = req.student ? req.student.fullName : 'Unknown';
            const roomInfo = req.room ? `${req.room.building}-${req.room.roomNumber}` : 'N/A';
            console.log(`   ✓ ${req.issueType.padEnd(12)} | ${req.priority.padEnd(10)} | ${req.status.padEnd(12)} | Room: ${roomInfo}`);
            console.log(`     Description: ${req.description}`);
        });

        console.log('\n' + '='.repeat(60));
        console.log('✅ Check complete!\n');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

checkData();
