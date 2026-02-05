# ✅ DEPLOYMENT CHECKLIST

## Pre-Deployment (Already Done ✅)
- [x] Created `backend/.env.production`
- [x] Updated `backend/server.js` with CORS
- [x] Created `frontend/.env.production`
- [x] Created `frontend/src/config/api.js`
- [x] Updated `frontend/src/services/api.js`
- [x] Updated `frontend/vite.config.js`

---

## MongoDB Atlas Setup

### Step 1: Create Account
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Sign up for free account
- [ ] Create new project: `OBU-Dormitory-System`

### Step 2: Create Cluster
- [ ] Click "Build a Database"
- [ ] Choose M0 FREE tier
- [ ] Provider: AWS
- [ ] Region: Frankfurt (eu-central-1) or Bahrain (me-south-1)
- [ ] Cluster Name: `obudms-cluster`
- [ ] Wait 3-5 minutes

### Step 3: Database User
- [ ] Database Access → Add New Database User
- [ ] Username: `obudms_admin`
- [ ] Password: (Autogenerate and SAVE IT!)
- [ ] Privileges: Read and write to any database

### Step 4: Network Access
- [ ] Network Access → Add IP Address
- [ ] Allow Access from Anywhere (0.0.0.0/0)

### Step 5: Connection String
- [ ] Database → Connect → Connect your application
- [ ] Copy connection string
- [ ] Update `backend/.env.production` with:
  ```
  MONGO_URI=mongodb+srv://obudms_admin:YOUR_PASSWORD@obudms-cluster.xxxxx.mongodb.net/obudms?retryWrites=true&w=majority
  ```

---

## Render.com Deployment

### Step 1: Create Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render

### Step 2: Deploy Backend
- [ ] New + → Web Service
- [ ] Connect repository
- [ ] Configure:
  ```
  Name: obudms-backend
  Region: Frankfurt (EU Central)
  Branch: master
  Root Directory: backend
  Build Command: npm install
  Start Command: npm start
  Instance Type: Free
  ```
- [ ] Add Environment Variables:
  ```
  PORT=5000
  MONGO_URI=(from MongoDB Atlas)
  JWT_SECRET=(from .env.production)
  NODE_ENV=production
  ALLOWED_ORIGIN=https://obudms-frontend.onrender.com
  ```
- [ ] Create Web Service
- [ ] Wait for deployment
- [ ] Test: Visit `https://obudms-backend.onrender.com`

### Step 3: Deploy Frontend
- [ ] New + → Static Site
- [ ] Connect repository
- [ ] Configure:
  ```
  Name: obudms-frontend
  Branch: master
  Root Directory: frontend
  Build Command: npm install && npm run build
  Publish Directory: dist
  ```
- [ ] Add Environment Variable:
  ```
  VITE_API_URL=https://obudms-backend.onrender.com
  ```
- [ ] Create Static Site
- [ ] Wait for deployment

### Step 4: Update CORS
- [ ] Backend → Environment
- [ ] Update `ALLOWED_ORIGIN` to actual frontend URL
- [ ] Save (auto-redeploys)

---

## Database Seeding

### Option A: Render Shell
- [ ] Backend service → Shell tab
- [ ] Run: `node seedAdminSystem.js`
- [ ] Run: `node seeder.js`

### Option B: Local
- [ ] Update local `.env` with production MONGO_URI
- [ ] Run: `cd backend && node seedAdminSystem.js`
- [ ] Run: `node seeder.js`
- [ ] Restore local `.env`

---

## Testing

- [ ] Visit frontend URL
- [ ] Login with: `admin` / `password123`
- [ ] Change admin password
- [ ] Test student import
- [ ] Test room allocation
- [ ] Test student portal
- [ ] Test reports generation
- [ ] Test all admin features

---

## Post-Deployment

- [ ] Change default admin password
- [ ] Set up monitoring alerts
- [ ] Configure custom domain (optional)
- [ ] Schedule regular backups
- [ ] Document admin procedures
- [ ] Train staff

---

## URLs to Save

```
Frontend: https://obudms-frontend.onrender.com
Backend:  https://obudms-backend.onrender.com
MongoDB:  (Atlas Dashboard)
```

---

## Important Credentials

```
MongoDB Atlas:
- Username: obudms_admin
- Password: [SAVE THIS SECURELY]

Default Admin:
- Username: admin
- Password: password123 (CHANGE IMMEDIATELY)

JWT Secret: (in .env.production)
```

---

## Support Resources

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com
- Project Repo: [Your GitHub URL]

---

**Estimated Time:** 30-45 minutes
**Cost:** FREE (or $7/month for always-on backend)
