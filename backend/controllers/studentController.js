const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Room = require('../models/Room');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({}).populate('room');
    res.json(students);
});

// @desc    Get student by ID (MongoDB ID)
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('room');

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Get student by University ID (e.g., OBU/001/2023)
// @route   POST /api/students/lookup
// @access  Public
const getStudentByUniversityId = asyncHandler(async (req, res) => {
    const { studentId } = req.body;

    // Case insensitive search
    const student = await Student.findOne({
        studentId: { $regex: new RegExp(`^${studentId}`, 'i') }
    }).populate('room');

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student placement not found');
    }
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
    const { studentId, fullName, gender, department, year, phone } = req.body;

    const studentExists = await Student.findOne({ studentId });

    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    const student = await Student.create({
        studentId,
        fullName,
        gender,
        department,
        year,
        phone,
    });

    if (student) {
        res.status(201).json(student);
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.fullName = req.body.fullName || student.fullName;
        student.department = req.body.department || student.department;
        student.year = req.body.year || student.year;
        student.phone = req.body.phone || student.phone;

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Delete all students
// @route   DELETE /api/students/bulk/all
// @access  Private/Admin
const deleteAllStudents = asyncHandler(async (req, res) => {
    console.log('🗑️ Deleting all students...');
    
    const result = await Student.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} students`);
    
    res.json({ 
        success: true,
        message: `Successfully deleted ${result.deletedCount} students`,
        deletedCount: result.deletedCount 
    });
});

// @desc    Import students from Excel or CSV
// @route   POST /api/students/import
// @access  Private/Admin
const importStudents = asyncHandler(async (req, res) => {
    console.log('📥 Import request received');
    
    if (!req.file) {
        console.log('❌ No file uploaded');
        res.status(400);
        throw new Error('No file uploaded');
    }

    console.log('📄 File details:', {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
    });

    const xlsx = require('xlsx');
    let data;

    try {
        // Check file extension
        const fileName = req.file.originalname.toLowerCase();
        
        if (fileName.endsWith('.csv')) {
            console.log('📊 Processing CSV file');
            // Handle CSV file
            const csvContent = req.file.buffer.toString('utf-8');
            const workbook = xlsx.read(csvContent, { type: 'string' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        } else {
            console.log('📊 Processing Excel file');
            // Handle Excel file
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            console.log('📋 Sheet name:', sheetName);
            const sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        }
        
        console.log('✅ File parsed successfully');
        console.log('📊 Total rows found:', data.length);
        
        if (data.length > 0) {
            console.log('📋 First row columns:', Object.keys(data[0]));
            console.log('📋 First row sample:', data[0]);
        }
    } catch (parseError) {
        console.error('❌ Parse error:', parseError);
        res.status(400);
        throw new Error('Failed to parse file: ' + parseError.message);
    }

    if (!data || data.length === 0) {
        console.log('❌ No data found in file');
        res.status(400);
        throw new Error('File is empty or has no valid data');
    }

    const importedStudents = [];
    const errors = [];
    
    console.log('🔄 Starting to process rows...');

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        console.log(`\n--- Processing Row ${i + 1} ---`);
        console.log('Raw row data:', JSON.stringify(row, null, 2));

        try {
            // More flexible column name matching (case-insensitive, with spaces/underscores)
            const getColumnValue = (row, ...possibleNames) => {
                for (const name of possibleNames) {
                    // Try exact match
                    if (row[name] !== undefined && row[name] !== '') return row[name];
                    
                    // Try case-insensitive match
                    const key = Object.keys(row).find(k => 
                        k.toLowerCase().replace(/[_\s]/g, '') === name.toLowerCase().replace(/[_\s]/g, '')
                    );
                    if (key && row[key] !== undefined && row[key] !== '') return row[key];
                }
                return null;
            };

            const studentData = {
                studentId: getColumnValue(row, 'ID', 'studentId', 'StudentID', 'Student ID', 'student_id', 'id', 'Student Id', 'STUDENT ID'),
                fullName: getColumnValue(row, 'English Name', 'English name', 'english name', 'ENGLISH NAME', 'fullName', 'FullName', 'Full Name', 'full_name', 'Name', 'name', 'FULL NAME', 'Student Name', 'StudentName', 'student_name', 'STUDENT NAME'),
                gender: getColumnValue(row, 'S', 's', 'gender', 'Gender', 'Sex', 'sex', 'GENDER', 'SEX'),
                department: getColumnValue(row, 'Dept', 'dept', 'DEPT', 'department', 'Department', 'DEPARTMENT'),
                year: getColumnValue(row, 'Year', 'year', 'YEAR', 'Level', 'level', 'LEVEL', 'Year Level', 'year_level'),
                phone: getColumnValue(row, 'phone', 'Phone', 'PhoneNumber', 'Phone Number', 'phone_number', 'Contact', 'contact', 'PHONE', 'CONTACT', 'Mobile', 'mobile', 'Tel', 'tel'),
            };

            console.log(`Row ${i + 1} extracted:`, studentData);

            // Validate required fields
            if (!studentData.studentId || !studentData.fullName || !studentData.gender || !studentData.department || !studentData.year) {
                console.log(`❌ Row ${i + 2}: Missing required fields`);
                errors.push({ 
                    row: i + 2, 
                    error: 'Missing required fields', 
                    data: row,
                    extracted: studentData 
                });
                continue;
            }

            // Parse year - handle '1st', '2nd', '3rd', '4th', '5th' or just numbers
            let yearValue = String(studentData.year).toLowerCase().trim();
            if (yearValue.includes('1st') || yearValue.includes('1') || yearValue === 'first') {
                studentData.year = 1;
            } else if (yearValue.includes('2nd') || yearValue.includes('2') || yearValue === 'second') {
                studentData.year = 2;
            } else if (yearValue.includes('3rd') || yearValue.includes('3') || yearValue === 'third') {
                studentData.year = 3;
            } else if (yearValue.includes('4th') || yearValue.includes('4') || yearValue === 'fourth') {
                studentData.year = 4;
            } else if (yearValue.includes('5th') || yearValue.includes('5') || yearValue === 'fifth') {
                studentData.year = 5;
            } else if (yearValue.includes('6th') || yearValue.includes('6') || yearValue === 'sixth') {
                studentData.year = 6;
            } else if (yearValue.includes('7th') || yearValue.includes('7') || yearValue === 'seventh') {
                studentData.year = 7;
            } else {
                studentData.year = parseInt(yearValue);
            }
            
            if (isNaN(studentData.year) || studentData.year < 1 || studentData.year > 7) {
                console.log(`❌ Row ${i + 2}: Invalid year: ${yearValue}`);
                errors.push({ row: i + 2, error: `Invalid year value: ${yearValue}`, data: row });
                continue;
            }

            // Convert phone to string (optional field)
            studentData.phone = studentData.phone ? String(studentData.phone) : '';

            // Normalize gender (accept M/F or Male/Female)
            const genderStr = String(studentData.gender).toUpperCase();
            if (genderStr.startsWith('M') || genderStr === 'M') {
                studentData.gender = 'M';
            } else if (genderStr.startsWith('F') || genderStr === 'F') {
                studentData.gender = 'F';
            } else {
                console.log(`❌ Row ${i + 2}: Invalid gender: ${studentData.gender}`);
                errors.push({ row: i + 2, error: 'Invalid gender (must be M/F or Male/Female)', data: row });
                continue;
            }

            // Check if student already exists
            const existingStudent = await Student.findOne({ studentId: studentData.studentId });

            if (existingStudent) {
                console.log(`🔄 Updating existing student: ${studentData.studentId}`);
                // Update existing student
                existingStudent.fullName = studentData.fullName;
                existingStudent.gender = studentData.gender;
                existingStudent.department = studentData.department;
                existingStudent.year = studentData.year;
                existingStudent.phone = studentData.phone;
                await existingStudent.save();
                importedStudents.push({ ...studentData, updated: true });
            } else {
                console.log(`✅ Creating new student: ${studentData.studentId}`);
                // Create new student
                await Student.create(studentData);
                importedStudents.push({ ...studentData, updated: false });
            }
        } catch (error) {
            console.error(`❌ Error processing row ${i + 2}:`, error);
            errors.push({ row: i + 2, error: error.message, data: row });
        }
    }

    console.log(`✅ Import complete: ${importedStudents.length} imported, ${errors.length} errors`);
    
    if (errors.length > 0) {
        console.log('\n❌ ERRORS FOUND:');
        errors.slice(0, 5).forEach(err => {
            console.log(`Row ${err.row}:`, err.error);
            console.log('Data:', err.data);
            if (err.extracted) {
                console.log('Extracted:', err.extracted);
            }
        });
        if (errors.length > 5) {
            console.log(`... and ${errors.length - 5} more errors`);
        }
    }

    res.json({
        success: true,
        imported: importedStudents.length,
        errors: errors.length,
        details: { importedStudents, errors }
    });
});

// @desc    Generate PDF report for students by gender
// @route   GET /api/students/report/pdf
// @access  Private/Admin
const generatePDFReport = asyncHandler(async (req, res) => {
    const { gender } = req.query;
    
    const students = await Student.find({ gender }).populate('room').sort({ studentId: 1 });
    
    if (students.length === 0) {
        res.status(404);
        throw new Error('No students found');
    }

    // Simple HTML to PDF approach
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #3b82f6; color: white; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9fafb; }
                .header { text-align: center; margin-bottom: 30px; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Oda Bultum University</h1>
                <h2>Dormitory Management System</h2>
                <h3>${gender === 'M' ? 'Male' : 'Female'} Students Report</h3>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Department</th>
                        <th>Room Number</th>
                    </tr>
                </thead>
                <tbody>
    `;

    students.forEach((student, index) => {
        const roomNumber = student.room ? `${student.room.building}-${student.room.roomNumber}` : 'Not Assigned';
        html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.fullName}</td>
                        <td>${student.studentId}</td>
                        <td>${student.department}</td>
                        <td>${roomNumber}</td>
                    </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Students: ${students.length}</p>
                <p>&copy; ${new Date().getFullYear()} Oda Bultum University - Dormitory Management System</p>
            </div>
        </body>
        </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=students_${gender}_report.html`);
    res.send(html);
});

// @desc    Generate CSV report for students by gender
// @route   GET /api/students/report/csv
// @access  Private/Admin
const generateCSVReport = asyncHandler(async (req, res) => {
    const { gender } = req.query;
    
    const students = await Student.find({ gender }).populate('room').sort({ studentId: 1 });
    
    if (students.length === 0) {
        res.status(404);
        throw new Error('No students found');
    }

    // Create CSV content
    let csv = 'No.,Student Name,Student ID,Department,Room Number\n';
    
    students.forEach((student, index) => {
        const roomNumber = student.room ? `${student.room.building}-${student.room.roomNumber}` : 'Not Assigned';
        csv += `${index + 1},"${student.fullName}","${student.studentId}","${student.department}","${roomNumber}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=students_${gender}_report.csv`);
    res.send(csv);
});

module.exports = {
    getStudents,
    getStudentById,
    getStudentByUniversityId,
    createStudent,
    updateStudent,
    deleteStudent,
    deleteAllStudents,
    importStudents,
    generatePDFReport,
    generateCSVReport,
};
