# Render Environment Variables Setup Guide

## 🎯 What You Need to Do

Add 3 new Cloudinary environment variables to your Render backend service.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Go to Render Dashboard
Open: https://dashboard.render.com/

### Step 2: Select Your Backend Service
Click on your backend service (the one running your Node.js/Express API)

### Step 3: Open Environment Settings
- Look for "Environment" in the left sidebar
- Click on it

### Step 4: Add First Variable
Click the **"Add Environment Variable"** button

**Variable 1:**
```
Key: CLOUDINARY_CLOUD_NAME
Value: dilqywrsz
```
Click "Save"

### Step 5: Add Second Variable
Click **"Add Environment Variable"** again

**Variable 2:**
```
Key: CLOUDINARY_API_KEY
Value: 585728324617654
```
Click "Save"

### Step 6: Add Third Variable
Click **"Add Environment Variable"** again

**Variable 3:**
```
Key: CLOUDINARY_API_SECRET
Value: wUGc9rVluORWYaLy_15f2xUoCh0
```
Click "Save"

### Step 7: Save Changes
Click the **"Save Changes"** button at the bottom

### Step 8: Wait for Redeploy
Render will automatically redeploy your service (takes ~2-3 minutes)

---

## ✅ VERIFICATION

After redeployment completes, verify these variables exist:

### Cloudinary Variables (NEW)
- ✅ `CLOUDINARY_CLOUD_NAME` = `dilqywrsz`
- ✅ `CLOUDINARY_API_KEY` = `585728324617654`
- ✅ `CLOUDINARY_API_SECRET` = `wUGc9rVluORWYaLy_15f2xUoCh0`

### Existing Variables (Should Already Be There)
- ✅ `PORT` = `5000` (or auto-set by Render)
- ✅ `MONGO_URI` = (your MongoDB connection string)
- ✅ `JWT_SECRET` = `obudms_secret_key_12345`
- ✅ `NODE_ENV` = `production`
- ✅ `ALLOWED_ORIGIN` = `https://obudms.vercel.app`

---

## 🧪 TEST AFTER DEPLOYMENT

### 1. Check Render Logs
- Go to "Logs" tab in Render
- Look for "Server running on port..."
- Should see no errors about Cloudinary

### 2. Test Image Upload
1. Go to https://obudms.vercel.app
2. Login as admin
3. Navigate to Gallery
4. Click "Add Image"
5. Upload a test image
6. Should see success message

### 3. Verify on Cloudinary
1. Go to https://cloudinary.com/console
2. Click "Media Library"
3. Look for "obu-gallery" folder
4. Your uploaded image should be there

### 4. Check Home Page
1. Go to home page
2. Scroll to Gallery section
3. Your image should appear in the carousel
4. Page should load fast (<1 second)

---

## 🚨 TROUBLESHOOTING

### Issue: "Cloudinary configuration error"
**Solution**: 
- Double-check all 3 variables are spelled correctly
- No extra spaces in values
- Click "Save Changes" after adding all variables

### Issue: "Upload failed"
**Solution**:
- Check Render logs for specific error
- Verify API secret is correct
- Make sure all 3 Cloudinary variables are set

### Issue: Images not appearing
**Solution**:
- Clear browser cache
- Check Cloudinary dashboard for uploaded images
- Verify frontend is pointing to correct backend URL

---

## 📊 COMPLETE ENVIRONMENT VARIABLES LIST

Here's what your Render environment should look like:

```
PORT=5000
MONGO_URI=mongodb+srv://mbb75303_db_user:3N51QVF56yBBe0Bz@cluster0.7vzla2y.mongodb.net/obudms?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=obudms_secret_key_12345
NODE_ENV=production
ALLOWED_ORIGIN=https://obudms.vercel.app
CLOUDINARY_CLOUD_NAME=dilqywrsz
CLOUDINARY_API_KEY=585728324617654
CLOUDINARY_API_SECRET=wUGc9rVluORWYaLy_15f2xUoCh0
```

**Note**: Don't copy-paste this entire block. Add each variable individually through Render's UI.

---

## ⏱️ TIME REQUIRED

- Adding variables: 2 minutes
- Render redeploy: 2-3 minutes
- Testing: 2 minutes
- **Total: ~7 minutes**

---

## 🎉 DONE!

Once Render finishes redeploying, your Cloudinary integration will be live in production!

Your images will:
- ✅ Upload to Cloudinary
- ✅ Load fast with CDN
- ✅ Be automatically optimized
- ✅ Appear on home page
- ✅ Work perfectly in production
