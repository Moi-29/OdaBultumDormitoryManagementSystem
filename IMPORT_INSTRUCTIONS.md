# Student Import & Auto-Allocation Guide

## Import Students

### File Format
You can import students using either CSV or Excel (.xlsx, .xls) files.

**Required Columns:**
- `studentId` - Student ID (e.g., OBU/001/2024)
- `fullName` - Full name of the student
- `gender` - Gender (M/F or Male/Female)
- `department` - Department name
- `year` - Year level (1, 2, 3, or 4)
- `phone` - Phone number (optional)

### Sample Files
- **CSV**: `students_sample.csv` - Ready to use
- **Excel**: You can convert the CSV to Excel or create your own

### How to Import
1. Go to Admin Dashboard → Students
2. Click "Choose File" under "Import Students"
3. Select your CSV or Excel file
4. Click "Import Students"
5. Wait for the success message showing how many students were imported

### Features
- **Duplicate Handling**: If a student with the same ID exists, their information will be updated
- **Error Reporting**: Any rows with errors will be reported
- **Validation**: Checks for required fields and valid data

## Auto-Allocation

### How It Works
The auto-allocation system assigns students to dorm rooms based on:

1. **Gender Separation**: Males and females are assigned to gender-specific rooms
2. **Priority Rules**:
   - Senior students (year > 1) are allocated first
   - Seniors are grouped by department
   - Freshmen (year 1) are allocated alphabetically
3. **Room Capacity**: Respects room capacity limits
4. **Availability**: Only assigns to available rooms (not under maintenance)

### How to Run Auto-Allocation
1. Make sure students are imported
2. Make sure rooms are created in the Dormitories section
3. Click "Run Auto-Allocation" button
4. Wait for the success message showing allocation results

### Allocation Results
The system will show:
- Number of males allocated
- Number of females allocated
- Number of students that couldn't be allocated (if rooms are full)

## Troubleshooting

### Import Not Working
1. **Check Backend**: Make sure the backend server is running on port 5000
2. **Check File Format**: Ensure your file has the correct columns
3. **Check Console**: Open browser console (F12) to see detailed error messages
4. **Check File Size**: Very large files may take longer to process

### Allocation Not Working
1. **Check Students**: Make sure students are imported first
2. **Check Rooms**: Make sure rooms are created in the Dormitories section
3. **Check Room Status**: Rooms must not be "Under Maintenance"
4. **Check Capacity**: Make sure there are enough rooms for all students

## Testing

To test the system:
1. Import the sample file: `students_sample.csv`
2. Go to Dormitories and verify rooms exist
3. Run auto-allocation
4. Check the Students page to see room assignments
