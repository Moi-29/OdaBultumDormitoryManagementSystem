# ⚡ QUICK START CHECKLIST

## Before You Start
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running

## Backend Setup (5 minutes)
```bash
cd backend
npm install
node seeder.js
npm run dev
```
✅ Should see: "Server running on port 5000" and "MongoDB Connected"

## Frontend Setup (3 minutes)
```bash
# Open NEW terminal
cd frontend
npm install
npm run dev
```
✅ Should see: "Local: http://localhost:5173/"

## Test It (1 minute)
1. Open: http://localhost:5173/login
2. Login: `admin` / `password123`
3. Explore the dashboard!

## Files Fixed
✅ Created `backend/.env` with MongoDB connection
✅ Fixed `backend/controllers/studentController.js` (syntax error)
✅ Updated `frontend/vite.config.js` (API proxy)
✅ Updated `frontend/src/context/AuthContext.jsx` (API calls)

## Common Commands
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Reset database
cd backend && node seeder.js

# Install dependencies
npm install
```

## Default Credentials
**Admin:** admin / password123
**Maintenance:** maintenance / password123

## Ports
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MongoDB: mongodb://localhost:27017

## Need Help?
See SETUP_GUIDE.md for detailed instructions and troubleshooting.
