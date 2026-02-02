const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api';

async function debugStudents() {
    try {
        console.log('🔍 Checking Student Database State...');

        // Login not needed if endpoints are public or we use the local running instance efficiently
        // Attempting to fetch all students
        const response = await axios.get(`${BASE_URL}/students`);
        const students = response.data;

        console.log(`Total Students Found: ${students.length}`);

        const unassigned = students.filter(s => !s.room);
        const assigned = students.filter(s => s.room);

        console.log(`\n📊 Status Summary:`);
        console.log(`- Assigned: ${assigned.length}`);
        console.log(`- Unassigned: ${unassigned.length}`);

        if (unassigned.length > 0) {
            console.log(`\n📝 First 5 Unassigned Students:`);
            unassigned.slice(0, 5).forEach(s => {
                console.log(`   - ID: ${s.studentId}, Name: ${s.fullName}, Gender: ${s.gender}, Year: ${s.year} (Type: ${typeof s.year}), Dept: ${s.department}`);
            });
        }

        // Also check Rooms availability
        const roomsRes = await axios.get(`${BASE_URL}/dorms`);
        const rooms = roomsRes.data;
        const availableRooms = rooms.filter(r => r.status === 'Available');

        console.log(`\n🏠 Rooms Summary:`);
        console.log(`- Total Rooms: ${rooms.length}`);
        console.log(`- Available Rooms: ${availableRooms.length}`);

    } catch (error) {
        console.error('❌ Error fetching data:', error.message);
    }
}

debugStudents();
