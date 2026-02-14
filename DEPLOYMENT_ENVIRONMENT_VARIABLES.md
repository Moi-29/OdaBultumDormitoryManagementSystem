# Deployment Environment Variables Guide

## ✅ .gitignore Protection - COMPLETE

Your `.gitignore` file already protects all sensitive information:
- ✅ All `.env` files are ignored
- ✅ Backend `.env` files protected
- ✅ Frontend `.env` files protected
- ✅ API secrets will NOT be committed to Git

---

## 🚀 VERCEL DEPLOYMENT (Frontend)

### Environment Variables to Add

Go to your Vercel project → Settings → Environment Variables

Add this variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` |

**Important**: Replace `your-backend-url` with your actual Render backend URL.

### Steps:
1. Go to https://vercel.com/dashboard
2. Select your project (obudms frontend)
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar
5. Add the variable above
6. Click "Save"
7. Redeploy your project

### Current Frontend .env.example
Your frontend should have a `.env.example` file with:
```env
VITE_API_URL=http://localhost:5000
```

For production on Vercel, it should point to your Render backend URL.

---

## 🚀 RENDER DEPLOYMENT (Backend)

### Environment Variables to Add

Go to your Render service → Environment → Environment Variables

Add these variables:

| Name | Value | Notes |
|------|-------|-------|
| `PORT` | `5000` | Render will override this automatically |
| `MONGO_URI` | `mongodb+srv://mbb75303_db_user:3N51QVF56yBBe0Bz@cluster0.7vzla2y.mongodb.net/obudms?retryWrites=true&w=majority&appName=Cluster0` | Your MongoDB connection |
| `JWT_SECRET` | `obudms_secret_key_12345` | Your JWT secret |
| `NODE_ENV` | `production` | Set to production |
| `ALLOWED_ORIGIN` | `https://obudms.vercel.app` | Your Vercel frontend URL |
| `CLOUDINARY_CLOUD_NAME` | `dilqywrsz` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `585728324617654` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `wUGc9rVluORWYaLy_15f2xUoCh0` | Your Cloudinary API secret |

### Steps:
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click "Environment" in sidebar
4. Click "Add Environment Variable"
5. Add each variable from the table above
6. Click "Save Changes"
7. Render will automatically redeploy

---

## 🔒 SECURITY CHECKLIST

### ✅ Already Protected
- [x] `.env` files in `.gitignore`
- [x] MongoDB credentials not in code
- [x] JWT secret not in code
- [x] Cloudinary credentials not in code

### ⚠️ IMPORTANT: Never Commit These
- ❌ `backend/.env`
- ❌ `frontend/.env`
- ❌ Any file with passwords/secrets
- ❌ Database connection strings
- ❌ API keys

### ✅ Safe to Commit
- ✅ `.env.example` files (with placeholder values)
- ✅ `.env.production.example` (with placeholder values)
- ✅ Configuration files without secrets

---

## 📋 VERIFICATION CHECKLIST

### Before Deploying
- [ ] Check `.gitignore` includes all `.env` files ✅ (Already done)
- [ ] Verify no secrets in Git history
- [ ] Update environment variables on Vercel
- [ ] Update environment variables on Render

### After Deploying
- [ ] Test frontend can connect to backend
- [ ] Test image upload to Cloudinary from production
- [ ] Test gallery images load on home page
- [ ] Test announcements images load on home page
- [ ] Check Cloudinary dashboard for uploaded images

---

## 🔧 TROUBLESHOOTING

### Issue: Frontend can't connect to backend
**Solution**: 
1. Check `VITE_API_URL` on Vercel points to correct Render URL
2. Check `ALLOWED_ORIGIN` on Render includes your Vercel URL
3. Redeploy both frontend and backend

### Issue: Image upload fails
**Solution**:
1. Verify all 3 Cloudinary variables are set on Render:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Check Render logs for errors
3. Verify API secret is correct (no extra spaces)

### Issue: CORS errors
**Solution**:
1. Check `ALLOWED_ORIGIN` on Render matches your Vercel URL exactly
2. Make sure it includes `https://` prefix
3. No trailing slash at the end

---

## 📊 CURRENT CONFIGURATION

### Backend (.env) - LOCAL ONLY
```env
PORT=5000
MONGO_URI=mongodb+srv://mbb75303_db_user:3N51QVF56yBBe0Bz@cluster0.7vzla2y.mongodb.net/obudms?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=obudms_secret_key_12345
NODE_ENV=development
ALLOWED_ORIGIN=https://obudms.vercel.app
CLOUDINARY_CLOUD_NAME=dilqywrsz
CLOUDINARY_API_KEY=585728324617654
CLOUDINARY_API_SECRET=wUGc9rVluORWYaLy_15f2xUoCh0
```

### Frontend (.env) - LOCAL ONLY
```env
VITE_API_URL=http://localhost:5000
```

**Note**: These files are NOT committed to Git. You must set these as environment variables on Vercel and Render.

---

## 🎯 DEPLOYMENT STEPS SUMMARY

### 1. Render (Backend)
```
1. Go to Render dashboard
2. Select your backend service
3. Environment → Add all 8 variables from table above
4. Save → Auto redeploys
```

### 2. Vercel (Frontend)
```
1. Go to Vercel dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Add VITE_API_URL with your Render backend URL
5. Save → Redeploy
```

### 3. Test
```
1. Visit your Vercel URL
2. Login as admin
3. Go to Gallery → Upload image
4. Check Cloudinary dashboard
5. Check home page gallery
```

---

## ✨ WHAT'S DIFFERENT NOW

### Before Cloudinary
- Images stored as base64 in MongoDB
- Large database size
- Slow loading
- No optimization

### After Cloudinary
- Images stored on Cloudinary CDN
- Only URLs in MongoDB
- Fast loading (<1 second)
- Automatic optimization
- **Need to add 3 new environment variables on Render**

---

## 🚨 ACTION REQUIRED

### On Render (Backend)
Add these 3 NEW environment variables:
1. `CLOUDINARY_CLOUD_NAME` = `dilqywrsz`
2. `CLOUDINARY_API_KEY` = `585728324617654`
3. `CLOUDINARY_API_SECRET` = `wUGc9rVluORWYaLy_15f2xUoCh0`

### On Vercel (Frontend)
No changes needed if `VITE_API_URL` is already set correctly.

---

## 📞 NEED HELP?

If you encounter any issues:
1. Check Render logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Check browser console for JavaScript errors
4. Verify all environment variables are set correctly
