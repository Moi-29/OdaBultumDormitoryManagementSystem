const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();

const importStudents = async () => {
    try {
        // Connect to database
        await connectDB();

        // Read CSV file
        const csvPath = path.join(__dirname, '..', 'students_sample.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        
        // Parse CSV
        const lines = csvContent.trim().split('\n');
        const headers = lines[0].split(',');
        
        console.log('📋 CSV Headers:', headers);
        console.log('📊 Total rows to import:', lines.length - 1);
        console.log('');

        const students = [];
        const errors = [];

        // Process each line (skip header)
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            
            if (values.length < 6) {
                console.log(`⚠️  Skipping row ${i + 1}: Incomplete data`);
                continue;
            }

            const studentData = {
                studentId: values[0].trim(),
                fullName: values[1].trim(),
                gender: values[2].trim(),
                department: values[3].trim(),
                year: parseInt(values[4].trim()),
                phone: values[5].trim()
            };

            try {
                // Check if student already exists
                const existingStudent = await Student.findOne({ studentId: studentData.studentId });

                if (existingStudent) {
                    // Update existing student
                    existingStudent.fullName = studentData.fullName;
                    existingStudent.gender = studentData.gender;
                    existingStudent.department = studentData.department;
                    existingStudent.year = studentData.year;
                    existingStudent.phone = studentData.phone;
                    await existingStudent.save();
                    console.log(`✅ Updated: ${studentData.studentId} - ${studentData.fullName}`);
                } else {
                    // Create new student
                    const newStudent = await Student.create(studentData);
                    console.log(`✅ Created: ${studentData.studentId} - ${studentData.fullName}`);
                }
                students.push(studentData);
            } catch (error) {
                console.error(`❌ Error with ${studentData.studentId}:`, error.message);
                errors.push({ row: i + 1, studentId: studentData.studentId, error: error.message });
            }
        }

        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📊 IMPORT SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Successfully imported: ${students.length} students`);
        console.log(`❌ Errors: ${errors.length}`);
        
        if (errors.length > 0) {
            console.log('');
            console.log('Error Details:');
            errors.forEach(err => {
                console.log(`  Row ${err.row} (${err.studentId}): ${err.error}`);
            });
        }

        console.log('');
        console.log('🎉 Import completed!');
        
        // Display all students in database
        const allStudents = await Student.find({}).sort({ studentId: 1 });
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('📚 ALL STUDENTS IN DATABASE');
        console.log('═══════════════════════════════════════');
        allStudents.forEach((student, index) => {
            console.log(`${index + 1}. ${student.studentId} - ${student.fullName} (${student.gender}, ${student.department}, Year ${student.year})`);
        });
        console.log('');
        console.log(`Total students in database: ${allStudents.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

// Run the import
importStudents();
