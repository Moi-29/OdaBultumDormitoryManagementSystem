# Application Edit Feature - Testing Guide

## Overview
This guide helps you test the complete application submission and editing workflow after deploying the latest changes.

---

## Prerequisites

### 1. Deploy Backend to Render
**CRITICAL: You MUST deploy the backend first!**

1. Go to: https://dashboard.render.com
2. Find service: `odabultumdormitorymanagementsystem`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete (2-3 minutes)
5. Check logs for: `Server running on port...`

### 2. Verify Frontend Deployment
- Frontend auto-deploys to Vercel from GitHub
- Check: https://obudms.vercel.app
- Should show the latest version

---

## Test Scenarios

### ✅ Scenario 1: New Student Submission

**Steps:**
1. Open: https://obudms.vercel.app
2. Click **"Application Form"** button
3. Enter a NEW Student ID: `TEST001/26`
4. Click **"Continue"**
5. Fill out all 4 tabs (Personal, Educational, School, Family)
6. Click **"Review & Submit"** on Family tab
7. Agreement modal appears with handshake icon
8. Click **"I Agree & Submit"**

**Expected Results:**
- ✅ Success notification: "Application submitted successfully!"
- ✅ Form closes after 3 seconds
- ✅ Admin dashboard shows new application
- ✅ Student ID appears in blue/bold
- ✅ Lock icon is LOCKED (gray)

---

### ✅ Scenario 2: Duplicate Submission Prevention

**Steps:**
1. Click **"Application Form"** again
2. Enter the SAME Student ID: `TEST001/26`
3. Click **"Continue"**

**Expected Results:**
- ❌ Error notification: "You have already submitted an application. Contact admin to request editing permission."
- ❌ Form does NOT open
- ✅ Student is blocked from resubmitting

---

### ✅ Scenario 3: Admin Grants Edit Permission

**Steps:**
1. Login as admin: https://obudms.vercel.app/login
   - Username: `admin`
   - Password: `password123`
2. Go to **Applications** sidebar
3. Find the application for `TEST001/26`
4. Click the **Lock icon** (should turn green/unlocked)
5. Verify: Lock icon changes to **Unlock icon** (green)

**Expected Results:**
- ✅ Lock icon changes to Unlock (green)
- ✅ Notification: "Edit permission enabled"
- ✅ `canEdit` is now `true` in database

---

### ✅ Scenario 4: Student Edits Application

**Steps:**
1. Logout from admin (or open incognito window)
2. Go to: https://obudms.vercel.app
3. Click **"Application Form"**
4. Enter Student ID: `TEST001/26`
5. Click **"Continue"**

**Expected Results:**
- ✅ Success notification: "You have permission to edit your application"
- ✅ Form opens with ALL existing data pre-filled
- ✅ All 4 tabs show previously submitted data

**Continue Editing:**
6. Change some fields (e.g., phone number, mother's name)
7. Navigate through all tabs
8. Click **"Review & Submit"** on Family tab
9. Agreement modal appears
10. Click **"I Agree & Submit"**

**Expected Results:**
- ✅ Success notification: "Application updated successfully! Your changes have been saved and the form is now locked."
- ✅ Form closes after 3 seconds
- ✅ Admin dashboard shows UPDATED data
- ✅ Lock icon is LOCKED again (gray)
- ✅ Old data is completely replaced with new data

---

### ✅ Scenario 5: Student Cannot Edit After Lock

**Steps:**
1. Click **"Application Form"** again
2. Enter Student ID: `TEST001/26`
3. Click **"Continue"**

**Expected Results:**
- ❌ Error notification: "You have already submitted an application. Contact admin to request editing permission."
- ❌ Form does NOT open
- ✅ Application is locked again after update

---

## Verification Checklist

### Backend Verification
- [ ] Backend deployed to Render successfully
- [ ] No errors in Render logs
- [ ] API endpoint `/api/applications/check/:studentId` working
- [ ] API endpoint `POST /api/applications` working
- [ ] API endpoint `PUT /api/applications/:id` working (public access)
- [ ] Duplicate prevention working (409 status code)

### Frontend Verification
- [ ] Frontend deployed to Vercel successfully
- [ ] Application Form button visible in header
- [ ] Student ID verification modal working
- [ ] Form pre-fills with existing data when editing
- [ ] Update request sent to correct endpoint
- [ ] Success/error notifications displaying properly

### Database Verification
- [ ] `studentId` field is unique in Application model
- [ ] `canEdit` field toggles correctly
- [ ] Old data replaced with new data on update
- [ ] `canEdit` set to `false` after update

### Admin Dashboard Verification
- [ ] Applications table shows Student ID (not School Name)
- [ ] Student ID displayed in blue with bold font
- [ ] Lock/Unlock toggle working
- [ ] View Details modal shows all data
- [ ] Updated data appears immediately after student edits

---

## Common Issues & Solutions

### Issue 1: "Server error while creating application"
**Solution:** Backend not deployed. Deploy to Render.

### Issue 2: Form doesn't pre-fill when editing
**Solution:** Check browser console for API errors. Verify `/api/applications/check/:studentId` returns application data.

### Issue 3: Update fails with 403 error
**Solution:** Verify `canEdit` is `true` in database. Admin must unlock first.

### Issue 4: Duplicate submission still allowed
**Solution:** Clear browser cache. Verify backend has latest code deployed.

### Issue 5: Student ID not showing in admin table
**Solution:** Refresh admin page. Check if `studentId` field exists in application data.

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)
```
POST   /api/applications              - Create new application
GET    /api/applications/check/:id    - Check if application exists
PUT    /api/applications/:id          - Update application (if canEdit=true)
```

### Protected Endpoints (Admin Only)
```
GET    /api/applications              - Get all applications
PATCH  /api/applications/:id/edit-permission  - Toggle edit permission
DELETE /api/applications/:id          - Delete single application
DELETE /api/applications/bulk         - Bulk delete applications
```

---

## Success Criteria

✅ **All scenarios pass without errors**
✅ **Duplicate prevention working**
✅ **Edit permission system working**
✅ **Data updates correctly**
✅ **Form locks after submission/update**
✅ **Admin can control edit access**
✅ **Student ID visible in admin dashboard**

---

## Next Steps After Testing

1. Test with multiple different Student IDs
2. Test with real student data
3. Verify activity logs in admin dashboard
4. Test bulk delete functionality
5. Test on mobile devices
6. Test with slow network connection

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check Render logs for backend errors
3. Verify all environment variables are set
4. Ensure MongoDB Atlas is accessible
5. Clear browser cache and try again

---

**Last Updated:** February 9, 2026
**Version:** 2.0 - Edit Permission Feature
