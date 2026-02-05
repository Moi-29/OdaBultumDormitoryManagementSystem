# 📥 Student Import - Quick Reference Card

## ✅ What You Need

### Required Columns (any of these names work):

| Field | Accepted Column Names (examples) |
|-------|----------------------------------|
| **Student ID** | `ID`, `studentId`, `Student ID`, `Matric No`, `Reg No`, `Student.ID` |
| **Name** | `fullName`, `Full Name`, `English Name`, `Student Name` <br>OR separate: `First Name` + `Father Name` + `Last Name` |
| **Gender** | `gender`, `Sex`, `S`, `G`, `M/F` (values: M/F or Male/Female) |
| **Department** | `department`, `Dept`, `Faculty`, `Program`, `Course`, `Major` |
| **Year** | `year`, `Level`, `Class`, `Grade` (values: 1-7 or 1st-7th) |

### Optional Columns:
- **Phone**: `phone`, `Phone Number`, `Contact`, `Mobile`, `Tel`
- **List Number**: `No`, `#`, `S/N`, `Serial`, `Index`

## 🎯 Key Features

✅ **Case doesn't matter**: `STUDENT ID` = `student id` = `Student ID`

✅ **Special characters ignored**: `Student_ID` = `Student-ID` = `Student.ID`

✅ **Extra columns OK**: Add any extra columns - they'll be ignored

✅ **Name merging**: Separate first/middle/last names automatically combined

✅ **Flexible formats**: Excel (.xlsx, .xls) or CSV files

## 📋 Quick Examples

### Example 1: Standard Format
```csv
studentId,fullName,gender,department,year,phone
OBU/001/2024,Ahmed Ali,M,Computer Science,1,0911234567
```

### Example 2: Separate Names
```csv
First Name,Father Name,Last Name,ID,S,Dept,Year
Ahmed,Mohammed,Ali,OBU/001/2024,M,CS,1
```

### Example 3: With Extra Columns
```csv
No,English Name,Reg No,Sex,Faculty,Level,Contact,Notes,Status
1,Ahmed Ali,001,M,CS,1,0911234567,Good,Active
```

## ⚡ Quick Tips

1. **Don't rename your columns** - System recognizes many variations
2. **Keep extra data** - Notes, comments, etc. are automatically ignored
3. **Use your format** - No need to match exact column names
4. **Separate names work** - firstName + lastName automatically merged
5. **Gender flexible** - M/F or Male/Female both work

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| All rows fail | Check required columns exist (ID, Name, Gender, Dept, Year) |
| Names missing | Ensure name column(s) have data |
| Gender errors | Use M/F or Male/Female only |
| Year errors | Use 1-7 or 1st-7th format |

## 📞 Need Help?

See **FLEXIBLE_IMPORT_GUIDE.md** for detailed documentation.

---
**Quick Start**: Just upload your file - the system handles the rest! 🚀
