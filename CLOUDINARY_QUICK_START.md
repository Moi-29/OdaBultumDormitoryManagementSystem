# Cloudinary Quick Start - 3 Simple Steps

## Step 1: Get Your API Secret (2 minutes)

1. Go to: **https://cloudinary.com/console**
2. Log in with your account
3. On the dashboard, find "Product Environment Credentials"
4. Click **"View API Keys"** or **"Reveal API Secret"**
5. Copy the **API Secret** (the long hidden string)

## Step 2: Update .env File (1 minute)

Open `backend/.env` and replace this line:

```env
CLOUDINARY_API_SECRET=your_api_secret_here
```

With your actual secret:

```env
CLOUDINARY_API_SECRET=abc123xyz789...
```

## Step 3: Restart Backend (30 seconds)

```bash
cd backend
npm start
```

## ✅ Done!

Now you can:
- Upload images in Gallery → Stored on Cloudinary
- Upload images in Announcements → Stored on Cloudinary
- Images load fast (<1 second) with lazy loading
- Images optimized automatically by Cloudinary
- Images delivered via global CDN

---

## What Changed?

### Gallery & Announcements Admin Pages
- Now use **FormData** instead of base64
- Files upload directly to Cloudinary
- Cloudinary returns optimized URL
- URL stored in database (not the image)

### Home Page (Gallery & News Sections)
- Added **lazy loading** to all images
- Images only load when visible
- Faster initial page load
- Better performance

### Backend
- Cloudinary integration complete
- Automatic image optimization
- Automatic deletion from Cloudinary when deleted from admin

---

## Test It

1. Go to Admin → Gallery
2. Click "Add Image"
3. Choose "Upload Image"
4. Select a file from your computer
5. Click "Add Image"
6. Check your Cloudinary dashboard → You'll see the image in `obu-gallery` folder
7. Go to home page → Image appears in carousel
8. Page loads fast (<1 second)

Same process for Announcements (images go to `obu-news` folder).

---

## Need Help?

See `CLOUDINARY_SETUP_COMPLETE.md` for detailed documentation.
