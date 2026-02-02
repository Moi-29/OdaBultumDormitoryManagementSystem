# 🔐 HOW TO REVOKE TEAM ACCESS AFTER PROJECT

## When Project is Complete - Follow These Steps:

### Option 1: Change MongoDB Password (EASIEST - 2 minutes)

1. **Go to MongoDB Atlas:** https://cloud.mongodb.com
2. **Click "Database Access"** (left sidebar)
3. **Find user:** `mbb75303_db_user`
4. **Click "Edit"** button
5. **Click "Edit Password"**
6. **Generate new password** or enter a new one
7. **Copy the NEW password**
8. **Click "Update User"**

✅ **Result:** Old `.env` files your team has will STOP WORKING immediately!

### Option 2: Create New Database User (RECOMMENDED)

1. **Go to "Database Access"**
2. **Click "Add New Database User"**
3. **Create new username** (e.g., `obu_production_user`)
4. **Generate secure password**
5. **Set permissions:** "Read and write to any database"
6. **Click "Add User"**
7. **Update YOUR `.env`** with new credentials
8. **Delete old user** `mbb75303_db_user` (click "Delete" button)

✅ **Result:** Team's old credentials are completely invalid!

### Option 3: Restrict IP Access (ADDITIONAL SECURITY)

1. **Go to "Network Access"**
2. **Click "Edit"** on "0.0.0.0/0" (Allow from anywhere)
3. **Delete it**
4. **Click "Add IP Address"**
5. **Add ONLY your IP address** or your server's IP
6. **Click "Confirm"**

✅ **Result:** Even with correct password, they can't connect from their location!

### Option 4: Change JWT Secret (INVALIDATE TOKENS)

Update your `.env`:
```env
JWT_SECRET=NEW_COMPLETELY_DIFFERENT_SECRET_KEY_xyz789
```

✅ **Result:** All existing login tokens become invalid!

---

## 🎯 RECOMMENDED WORKFLOW

**During Development (NOW):**
```
1. Share .env file with team via private message
2. Everyone uses same MongoDB credentials
3. Work together on project
```

**After Project Complete:**
```
1. Change MongoDB password (2 minutes)
2. Update YOUR .env with new password
3. Change JWT_SECRET
4. Restrict IP access to your IP only
5. Team's .env files stop working ✅
```

---

## 📋 QUICK REVOKE CHECKLIST

When you want to revoke access:
- [ ] Change MongoDB password in Atlas
- [ ] Update your local .env with new password
- [ ] Change JWT_SECRET to new value
- [ ] (Optional) Restrict Network Access to your IP only
- [ ] Test that YOUR app still works
- [ ] Confirm team members can't access database

**Time needed:** 5 minutes
**Cost:** FREE
**Effectiveness:** 100% - They lose all access

---

## ⚠️ IMPORTANT NOTES

1. **Keep a backup** of your NEW credentials somewhere safe
2. **Test your app** after changing credentials to ensure it works
3. **Don't tell team** the new password
4. **Change password immediately** when project ends, don't wait

---

## 🔄 IF YOU NEED TO GIVE ACCESS AGAIN LATER

1. Create a NEW temporary user in MongoDB Atlas
2. Share those credentials
3. Delete that user when done
4. Your main credentials stay private

This way you maintain control!
