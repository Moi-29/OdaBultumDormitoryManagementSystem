# 🚀 OBU DORMITORY MANAGEMENT SYSTEM - DEPLOYMENT GUIDE

## ✅ STEP 1: PREPARATION (COMPLETED)

The following files have been created and configured:

### Backend Files:
- ✅ `backend/.env.production` - Production environment variables
- ✅ `backend/server.js` - Updated with production CORS settings

### Frontend Files:
- ✅ `frontend/.env.production` - Production environment variables
- ✅ `frontend/.env.development` - Development environment variables
- ✅ `frontend/src/config/api.js` - API configuration
- ✅ `frontend/src/services/api.js` - Updated API service with environment support
- ✅ `frontend/vite.config.js` - Updated build configuration

---

## 📋 STEP 2: SETUP MONGODB ATLAS

### 2.1 Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" or "Sign In"
   - Sign up with your email or Google account

2. **Create a New Project**
   - Click "New Project"
   - Name: `OBU-Dormitory-System`
   - Click "Create Project"

3. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - **Provider**: AWS
   - **Region**: Choose closest to Ethiopia (eu-central-1 Frankfurt or me-south-1 Bahrain)
   - **Cluster Name**: `obudms-cluster`
   - Click "Create"
   - Wait 3-5 minutes for cluster creation

### 2.2 Configure Database Access

1. **Create Database User**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - **Authentication Method**: Password
   - **Username**: `obudms_admin`
   - **Password**: Click "Autogenerate Secure Password" and SAVE IT!
   - **Database User Privileges**: "Read and write to any database"
   - Click "Add User"

2. **Configure Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Comment**: "Render.com deployment"
   - Click "Confirm"

### 2.3 Get Connection String

1. **Get Connection String**
   - Click "Database" in left sidebar
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - **Driver**: Node.js
   - **Version**: 5.5 or later
   - Copy the connection string

2. **Format Connection String**
   ```
   mongodb+srv://obudms_admin:<password>@obudms-cluster.xxxxx.mongodb.net/obudms?retryWrites=true&w=majority
   ```

3. **Update Backend .env.production**
   - Open `backend/.env.production`
   - Replace `YOUR_PASSWORD_HERE` with your actual database password
   - Replace the entire `MONGO_URI` line with your connection string
   - Make sure `obudms` is the database name in the string

**Example:**
```env
MONGO_URI=mongodb+srv://obudms_admin:MySecurePass123@obudms-cluster.abc123.mongodb.net/obudms?retryWrites=true&w=majority
```

---

## 🚀 STEP 3: DEPLOY TO RENDER.COM

### 3.1 Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended for auto-deploy)
4. Authorize Render to access your GitHub repositories

### 3.2 Deploy Backend

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `OdaBultumDormitoryManagementSystem`
   - Click "Connect"

2. **Configure Backend Service**
   ```
   Name: obudms-backend
   Region: Frankfurt (EU Central) - closest to Ethiopia
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

3. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables (copy from `backend/.env.production`):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://obudms_admin:YOUR_PASSWORD@obudms-cluster.xxxxx.mongodb.net/obudms?retryWrites=true&w=majority
   JWT_SECRET=54f9f7651a29afb144bf25e55b7ab10ca79e6d0b680a86f3e86d598dac44d434eef9f0253a9087adf72f9210b4865ed338fa2d934175d458c00af4ffdbafe430
   NODE_ENV=production
   ALLOWED_ORIGIN=https://obudms-frontend.onrender.com
   ```

4. **Create Web Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your backend URL will be: `https://obudms-backend.onrender.com`

5. **Test Backend**
   - Visit: `https://obudms-backend.onrender.com`
   - You should see: "API is running..."

### 3.3 Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Select your repository: `OdaBultumDormitoryManagementSystem`
   - Click "Connect"

2. **Configure Frontend Service**
   ```
   Name: obudms-frontend
   Branch: master
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   Click "Advanced" → "Add Environment Variable"
   ```
   VITE_API_URL=https://obudms-backend.onrender.com
   ```

4. **Create Static Site**
   - Click "Create Static Site"
   - Wait 5-10 minutes for deployment
   - Your frontend URL will be: `https://obudms-frontend.onrender.com`

### 3.4 Update CORS Settings

1. **Update Backend Environment Variable**
   - Go to Render Dashboard → `obudms-backend`
   - Click "Environment"
   - Update `ALLOWED_ORIGIN` to: `https://obudms-frontend.onrender.com`
   - Click "Save Changes"
   - Backend will automatically redeploy

---

## 🌱 STEP 4: SEED THE DATABASE

### Option A: Using Render Shell (Recommended)

1. **Access Backend Shell**
   - Go to Render Dashboard → `obudms-backend`
   - Click "Shell" tab
   - Wait for shell to connect

2. **Run Seed Commands**
   ```bash
   node seedAdminSystem.js
   node seeder.js
   ```

3. **Verify**
   - You should see success messages
   - Default admin account created

### Option B: Using Local Connection

1. **Update Local Environment**
   - Copy production `MONGO_URI` to local `backend/.env`

2. **Run Locally**
   ```bash
   cd backend
   node seedAdminSystem.js
   node seeder.js
   ```

3. **Restore Local Environment**
   - Change `MONGO_URI` back to local MongoDB

---

## ✅ STEP 5: TEST YOUR DEPLOYMENT

### 5.1 Access Your Application

1. **Visit Frontend**
   - URL: `https://obudms-frontend.onrender.com`
   - Should load the login page

2. **Login with Default Credentials**
   ```
   Username: admin
   Password: password123
   ```

3. **Change Admin Password**
   - Go to Admin Management → Security Settings
   - Change the default password immediately

### 5.2 Test All Features

- ✅ Student import (Excel/CSV)
- ✅ Room allocation
- ✅ Student portal lookup
- ✅ Reports generation (PDF/CSV)
- ✅ Admin management
- ✅ Activity logs

---

## 🔧 STEP 6: POST-DEPLOYMENT CONFIGURATION

### 6.1 Custom Domain (Optional)

If you have a custom domain (e.g., `dorms.obu.edu.et`):

1. **Frontend Domain**
   - Render Dashboard → `obudms-frontend` → Settings
   - Click "Custom Domain"
   - Add: `dorms.obu.edu.et`
   - Update DNS records as instructed

2. **Backend Domain**
   - Render Dashboard → `obudms-backend` → Settings
   - Click "Custom Domain"
   - Add: `api.dorms.obu.edu.et`
   - Update DNS records

3. **Update CORS**
   - Update `ALLOWED_ORIGIN` to: `https://dorms.obu.edu.et`

### 6.2 Enable Monitoring

1. **Render Monitoring**
   - Render Dashboard → Service → Metrics
   - Monitor CPU, Memory, Response times

2. **Set Up Alerts**
   - Settings → Notifications
   - Add email for downtime alerts

### 6.3 Regular Backups

Create a backup schedule:

1. **Manual Backup**
   - MongoDB Atlas → Clusters → Backup
   - Enable automated backups (paid feature)

2. **Export Data**
   - Use the backup routes in your application
   - Download student and room data regularly

---

## 💰 COST BREAKDOWN

### Free Tier (Render + MongoDB Atlas)
- **Backend**: FREE (sleeps after 15 min inactivity)
- **Frontend**: FREE
- **Database**: FREE (512MB storage)
- **Total**: **$0/month**

### Paid Tier (Recommended for Production)
- **Backend**: $7/month (always on, no sleep)
- **Frontend**: FREE
- **Database**: FREE
- **Total**: **$7/month**

---

## ⚠️ IMPORTANT NOTES

### Free Tier Limitations

**Backend Sleep Mode:**
- Sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

**Solutions:**
1. Upgrade to $7/month plan (recommended)
2. Use UptimeRobot to ping every 14 minutes (keeps it awake)
3. Accept the delay for low-traffic periods

### Security Checklist

- ✅ Change default admin password
- ✅ Keep JWT_SECRET secure
- ✅ Enable MongoDB IP whitelist
- ✅ Regular backups
- ✅ Monitor error logs
- ✅ Update dependencies regularly

---

## 🆘 TROUBLESHOOTING

### Backend Won't Start
```
Check:
1. Environment variables are correct
2. MongoDB connection string is valid
3. Check Render logs for errors
```

### Frontend Can't Connect
```
Check:
1. VITE_API_URL is correct
2. CORS settings in backend
3. Backend is running
4. Check browser console for errors
```

### Database Connection Failed
```
Check:
1. MongoDB Atlas IP whitelist (0.0.0.0/0)
2. Database user credentials
3. Connection string format
4. Network connectivity
```

### Import/Export Not Working
```
Check:
1. File size limits
2. File format (Excel/CSV)
3. Column names match template
4. Check backend logs
```

---

## 📞 SUPPORT

### Documentation
- Render: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Vite: https://vitejs.dev/guide/

### Contact
- Email: admin@obu.edu.et
- GitHub Issues: [Your Repository]

---

## 🎉 DEPLOYMENT COMPLETE!

Your OBU Dormitory Management System is now live!

**URLs:**
- Frontend: `https://obudms-frontend.onrender.com`
- Backend: `https://obudms-backend.onrender.com`

**Next Steps:**
1. Change default admin password
2. Import student data
3. Configure rooms and allocations
4. Train staff on system usage
5. Monitor system performance

---

**Last Updated:** February 2026
**Version:** 1.0.0
