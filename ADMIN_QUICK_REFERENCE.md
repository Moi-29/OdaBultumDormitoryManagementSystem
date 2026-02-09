# Admin Quick Reference - Application Management

## Lock/Unlock Icons Explained

### 🔒 Locked (Gray Lock Icon)
- **Meaning:** Student CANNOT edit their application
- **Status:** `canEdit: false`
- **Action:** Click to UNLOCK and allow editing

### 🔓 Unlocked (Green Unlock Icon)
- **Meaning:** Student CAN edit their application
- **Status:** `canEdit: true`
- **Action:** Click to LOCK and prevent editing

---

## Common Admin Tasks

### 1. Allow Student to Edit Application

**When to use:** Student made a mistake and needs to correct their application

**Steps:**
1. Go to **Applications** sidebar
2. Find the student's application
3. Click the **Lock icon** (gray) → Changes to **Unlock icon** (green)
4. Notify student they can now edit
5. Student submits updated application
6. Lock icon automatically returns to **Locked** (gray)

**Result:** Old data is completely replaced with new submission

---

### 2. View Application Details

**Steps:**
1. Go to **Applications** sidebar
2. Click **"View Details"** button
3. Modal opens with 4 tabs:
   - 📋 Personal Info
   - 🎓 Educational Info
   - 🏫 School Info
   - 👨‍👩‍👧 Family Info
4. Review all information
5. Click **X** to close

---

### 3. Delete Single Application

**Steps:**
1. Click **"Select"** button
2. Check the checkbox for the application
3. Click **"Delete (1)"** button
4. Confirm deletion
5. Application removed from database

---

### 4. Bulk Delete Applications

**Steps:**
1. Click **"Select"** button
2. Check multiple applications (or click header checkbox for all)
3. Click **"Delete (X)"** button (X = number selected)
4. Confirm deletion
5. All selected applications removed

---

## Application Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    STUDENT SUBMITS FORM                      │
│                    (canEdit: false)                          │
│                    🔒 LOCKED                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ADMIN CLICKS UNLOCK ICON                        │
│              (canEdit: true)                                 │
│              🔓 UNLOCKED                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         STUDENT EDITS & RESUBMITS FORM                       │
│         (Old data replaced with new data)                    │
│         (canEdit: false)                                     │
│         🔒 LOCKED AGAIN                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Student ID Display

- **Location:** Applications table, 3rd column
- **Format:** Blue text with bold font
- **Example:** `RU/1270/18`, `UGPR1212/12`
- **Purpose:** Unique identifier for each student

---

## Important Notes

⚠️ **Automatic Locking**
- Applications automatically lock after student submits
- Applications automatically lock after student updates
- Admin must manually unlock each time student needs to edit

⚠️ **Data Replacement**
- When student updates, OLD data is COMPLETELY REPLACED
- No history is kept of previous submissions
- Make sure student knows this before unlocking

⚠️ **Duplicate Prevention**
- Each Student ID can only have ONE application
- System prevents duplicate submissions
- Student must contact admin to edit existing application

⚠️ **Edit Permission is Temporary**
- Once student resubmits, permission is revoked
- Admin must unlock again if student needs another edit
- This prevents unauthorized changes

---

## Troubleshooting

### Student says they can't edit
**Check:** Is the Lock icon green (unlocked)?
**Fix:** Click the Lock icon to unlock

### Student submitted wrong data
**Fix:** 
1. Unlock their application
2. Tell them to resubmit with correct data
3. Application will lock automatically after resubmission

### Application not showing in table
**Check:** 
- Refresh the page
- Check if student completed all 4 tabs
- Check if student clicked "I Agree & Submit"

### Student ID not visible
**Check:**
- Refresh the page
- Verify student entered ID during verification
- Check browser console for errors

---

## Best Practices

✅ **DO:**
- Unlock applications only when student requests
- Verify student identity before unlocking
- Check submitted data before approving
- Keep track of which students have edit permission

❌ **DON'T:**
- Leave applications unlocked indefinitely
- Unlock without student request
- Delete applications without backup
- Allow multiple edits without verification

---

## Activity Logs

All admin actions are logged:
- Unlocking/Locking applications
- Deleting applications
- Updating applications
- Bulk operations

**View logs:** Go to **Admin Management** → **Activity Logs**

---

## Quick Stats

**View in Dashboard:**
- Total applications submitted
- Applications pending review
- Recent submissions
- Edit permissions granted

---

**Need Help?** Check the full testing guide: `APPLICATION_EDIT_TESTING_GUIDE.md`
