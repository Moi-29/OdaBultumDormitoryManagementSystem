const axios = require('axios');

// We need to connect to DB directly or use API if possible.
// Using API is safer but we don't have a "bulk update" API for this.
// So we'll use a direct script using the models if we can connect, 
// OR we can just loop through students via API and remove them.
// Let's us use the API approach to be safe and consistent.

const BASE_URL = 'http://localhost:5000/api';

async function resetAllocations() {
    console.log('🔄 Starting Allocation Reset...');

    try {
        // 1. Fetch all rooms
        const roomsRes = await axios.get(`${BASE_URL}/dorms`);
        const rooms = roomsRes.data;

        let cleanedRooms = 0;

        // Loop through rooms and clear occupants
        // We probably don't have a "clear room" endpoint, but we can update the room?
        // Actually, dormController has `updateRoom`. But clearing occupants might be tricky via updateRoom 
        // if it doesn't expose occupants field in the body.
        // Let's check updateRoom implementation...
        // It only updates: building, floor, roomNumber, type, capacity, gender, status.
        // It does NOT update occupants.

        // So we have to use `removeStudentFromRoom` for each occupant.
        // This might be slow if there are many, but for 7 students it's fine.

        for (const room of rooms) {
            if (room.occupants && room.occupants.length > 0) {
                console.log(`Cleaning Room ${room.roomNumber}...`);
                // We need to call remove for each student
                // Endpoints: POST /api/dorms/:id/remove body: { studentId: ID }
                // Note: the controller expects studentId (the mongo ID).

                // We can't easily iterate this way because `room.occupants` might be objects or IDs depending on populate.
                // The controller `getRooms` populates 'occupants'.

                for (const occupant of room.occupants) {
                    // occupant is an object because of populate
                    try {
                        await axios.post(`${BASE_URL}/dorms/${room._id}/remove`, {
                            studentId: occupant._id
                        });
                        cleanedRooms++;
                    } catch (e) {
                        console.error(`Failed to remove student ${occupant._id} from room ${room._id}:`, e.message);
                    }
                }
            }
        }

        console.log(`\n✅ Reset Complete! Removed ${cleanedRooms} students from rooms.`);
        console.log('You can now run the allocation again.');

    } catch (error) {
        console.error('❌ Error resetting:', error.message);
    }
}

resetAllocations();
