# 🚀 COMPLETE SETUP GUIDE - OBU Dormitory Management System

## ✅ PREREQUISITES

Before starting, ensure you have:
1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Either:
   - Local installation: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - OR MongoDB Atlas (cloud): [Sign up free](https://www.mongodb.com/cloud/atlas)
3. **Git** (optional, for version control)

## 📋 STEP-BY-STEP INSTALLATION

### Step 1: Install MongoDB (if not already installed)

**Option A: Local MongoDB**
- Download and install MongoDB Community Edition
- Start MongoDB service:
  ```bash
  # Windows (run as Administrator)
  net start MongoDB
  
  # Or use MongoDB Compass GUI
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at mongodb.com/cloud/atlas
- Create a cluster
- Get connection string (replace in backend/.env)
- Example: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/obudms`

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Verify .env file exists with correct settings
# File should contain:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/obudms
# JWT_SECRET=obudms_secret_key_12345
# NODE_ENV=development

# Seed the database with sample data
node seeder.js

# Start the backend server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: localhost
✅ Users created
✅ Rooms created
✅ Students created
✅ Students assigned to rooms
✅ Maintenance requests created
🎉 Database seeded successfully!
```

### Step 3: Frontend Setup

Open a NEW terminal window (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Access the Application

1. Open browser and go to: **http://localhost:5173**
2. Click "Login" or go to: **http://localhost:5173/login**

**Default Admin Credentials:**
- Username: `admin`
- Password: `password123`

**Default Maintenance Staff:**
- Username: `maintenance`
- Password: `password123`

## 🎯 TESTING THE APPLICATION

### Test Admin Features:
1. **Dashboard** - View statistics (students, rooms, maintenance)
2. **Students** - Add, edit, delete student records
3. **Dormitories** - Manage rooms and assign students
4. **Maintenance** - Track maintenance requests
5. **Inventory** - Manage dormitory assets

### Test API Endpoints:
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Get all students
curl http://localhost:5000/api/students

# Get all rooms
curl http://localhost:5000/api/dorms
```

## 🔧 TROUBLESHOOTING

### Issue: "MongoDB connection failed"
**Solution:**
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check MONGO_URI in backend/.env
- For Atlas, ensure IP is whitelisted

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in backend/.env to 5001
- Update frontend/vite.config.js proxy target to 5001

### Issue: "Cannot find module"
**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS errors"
**Solution:**
- Backend already has CORS enabled
- Ensure backend is running on port 5000
- Check vite.config.js proxy settings

### Issue: "Seeder fails"
**Solution:**
- Ensure MongoDB is running
- Delete existing database: `use obudms` then `db.dropDatabase()` in MongoDB shell
- Run seeder again: `node seeder.js`

## 📁 PROJECT STRUCTURE

```
odabultumdormitorymanagementsystem/
├── backend/
│   ├── config/db.js          # Database connection
│   ├── controllers/          # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   ├── .env                 # Environment variables (CREATED)
│   ├── server.js            # Express server
│   └── seeder.js            # Database seeder
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── context/         # React context (Auth)
    │   ├── pages/           # Page components
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    └── vite.config.js       # Vite configuration (UPDATED)
```

## 🔐 SECURITY NOTES

**For Production:**
1. Change JWT_SECRET to a strong random string
2. Use environment-specific .env files
3. Enable HTTPS
4. Add authentication middleware to protected routes
5. Implement rate limiting
6. Add input validation and sanitization
7. Use MongoDB Atlas with IP whitelisting

## 📊 DATABASE SCHEMA

**Collections:**
- `users` - Admin, maintenance staff, student accounts
- `students` - Student records and profiles
- `rooms` - Dormitory rooms and occupancy
- `maintenancerequests` - Maintenance tracking
- `assets` - Inventory management

## 🚀 DEPLOYMENT

**Backend (Node.js):**
- Heroku, Railway, Render, or DigitalOcean
- Set environment variables in hosting platform
- Use MongoDB Atlas for production database

**Frontend (React):**
- Vercel, Netlify, or GitHub Pages
- Build: `npm run build`
- Deploy the `dist` folder

## 📞 SUPPORT

For issues:
1. Check this guide first
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify MongoDB is running
5. Ensure all dependencies are installed

## ✨ NEXT STEPS

After successful setup:
1. Explore the admin dashboard
2. Add more students and rooms
3. Test room assignments
4. Create maintenance requests
5. Customize the UI in frontend/src/index.css
6. Add more features as needed

---

**Project Status:** ✅ Ready to run
**Last Updated:** February 2, 2026
