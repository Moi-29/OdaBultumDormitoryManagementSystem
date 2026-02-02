# 🔍 HOW TO CHECK SEEDER DATA

## Method 1: MongoDB Compass (GUI - Recommended)

1. **Download MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Connect** with your connection string:
   ```
   mongodb+srv://mbb75303_db_user:3N51QVF56yBBe0Bz@cluster0.7vzla2y.mongodb.net/obudms
   ```
3. **Browse Collections**:
   - Click `obudms` database
   - View `users`, `students`, `rooms`, `maintenancerequests`

---

## Method 2: Using API Endpoints (Quick Check)

Make sure your backend is running (`npm run dev` in backend folder), then:

### Check Users
```bash
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"password123\"}"
```

### Check Students
```bash
curl http://localhost:5000/api/students
```

### Check Rooms
```bash
curl http://localhost:5000/api/dorms
```

### Check Maintenance Requests
```bash
curl http://localhost:5000/api/maintenance
```

Or open in browser:
- http://localhost:5000/api/students
- http://localhost:5000/api/dorms
- http://localhost:5000/api/maintenance

---

## Method 3: Create a Quick Check Script

Create `backend/checkData.js`:

```javascript
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

        // Check Users
        const users = await User.find({}).select('-password');
        console.log('👥 USERS:');
        users.forEach(user => {
            console.log(`   - ${user.username} (${user.role}) - ${user.email}`);
        });

        // Check Students
        const students = await Student.find({}).populate('room');
        console.log(`\n🎓 STUDENTS (${students.length} total):`);
        students.forEach(student => {
            const roomInfo = student.room ? `${student.room.building}-${student.room.roomNumber}` : 'Not Assigned';
            console.log(`   - ${student.studentId}: ${student.fullName} (${student.gender}) - Room: ${roomInfo}`);
        });

        // Check Rooms
        const rooms = await Room.find({}).populate('occupants');
        console.log(`\n🏠 ROOMS (${rooms.length} total):`);
        rooms.forEach(room => {
            console.log(`   - ${room.building}-${room.roomNumber}: ${room.occupants.length}/${room.capacity} (${room.status})`);
        });

        // Check Maintenance Requests
        const requests = await MaintenanceRequest.find({}).populate('student room');
        console.log(`\n🔧 MAINTENANCE REQUESTS (${requests.length} total):`);
        requests.forEach(req => {
            console.log(`   - ${req.issueType} (${req.priority}): ${req.description} - Status: ${req.status}`);
        });

        console.log('\n✅ Check complete!\n');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`);
        process.exit(1);
    }
};

checkData();
```

Then run:
```bash
cd backend
node checkData.js
```

---

## Method 4: View Seeder File Directly

The seeder file shows exactly what data is created:

**Location**: `backend/seeder.js`

**What it creates:**

### Users (2):
1. **Admin**
   - Username: `admin`
   - Password: `password123`
   - Email: `admin@obu.edu.et`
   - Role: `admin`

2. **Maintenance**
   - Username: `maintenance`
   - Password: `password123`
   - Email: `maint@obu.edu.et`
   - Role: `maintenance`

### Students (5):
1. OBU/001/2023 - Abdi Mohammed (M) - Computer Science
2. OBU/002/2023 - Fatuma Ahmed (F) - Engineering
3. OBU/003/2023 - Chaltu Bekele (F) - Business
4. OBU/004/2023 - Getachew Haile (M) - Computer Science
5. OBU/005/2023 - Sara Tesfaye (F) - Medicine

### Rooms (6):
1. Block A-101 (Quad, 4 capacity, Male)
2. Block A-102 (Quad, 4 capacity, Male)
3. Block A-201 (Quad, 4 capacity, Female)
4. Block A-202 (Quad, 4 capacity, Female)
5. Block B-101 (Triple, 3 capacity, Male)
6. Block B-102 (Double, 2 capacity, Female)

### Maintenance Requests (3):
1. Electrical issue - Block A-101 (Pending)
2. Plumbing issue - Block A-201 (In Progress)
3. Furniture issue - Block A-201 (Completed)

---

## Quick Summary Command

Run this in your terminal (backend must be running):

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/students | Select-Object -ExpandProperty Content
```

Or just open in browser: http://localhost:5000/api/students
