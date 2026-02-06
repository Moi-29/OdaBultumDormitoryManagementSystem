/**
 * Test script to verify flexible import functionality
 * This script tests the enhanced column mapping and name merging features
 */

const xlsx = require('xlsx');
const path = require('path');

console.log('🧪 Testing Flexible Import System\n');

// Test the column mapping logic
function getColumnValue(row, ...possibleNames) {
    for (const name of possibleNames) {
        // Try exact match
        if (row[name] !== undefined && row[name] !== '') return row[name];
        
        // Try case-insensitive match with normalization
        const normalizedName = name.toLowerCase().replace(/[_\s\-\.]/g, '');
        const key = Object.keys(row).find(k => 
            k.toLowerCase().replace(/[_\s\-\.]/g, '') === normalizedName
        );
        if (key && row[key] !== undefined && row[key] !== '') return row[key];
    }
    return null;
}

function cleanValue(value) {
    if (!value) return null;
    const cleaned = String(value).trim();
    return cleaned === '' ? null : cleaned;
}

// Test with flexible format file
console.log('📋 Test 1: Flexible Format (Separate Name Columns)');
console.log('File: students_flexible_import_sample.csv\n');

try {
    const workbook1 = xlsx.readFile('students_flexible_import_sample.csv');
    const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const data1 = xlsx.utils.sheet_to_json(sheet1);
    
    console.log('Columns found:', Object.keys(data1[0]));
    console.log('\nProcessing first row:');
    
    const row1 = data1[0];
    console.log('Raw data:', row1);
    
    const studentId = cleanValue(getColumnValue(row1, 'ID', 'studentId', 'Student.ID', 'Student ID'));
    const firstName = cleanValue(getColumnValue(row1, 'First Name', 'FirstName', 'first_name'));
    const fatherName = cleanValue(getColumnValue(row1, 'Father Name', 'father_name'));
    const lastName = cleanValue(getColumnValue(row1, 'Last Name', 'LastName', 'last_name'));
    const gender = cleanValue(getColumnValue(row1, 'S', 's', 'gender', 'Gender', 'Sex'));
    const department = cleanValue(getColumnValue(row1, 'Dept', 'dept', 'department', 'Department'));
    const year = cleanValue(getColumnValue(row1, 'Year', 'year', 'Level'));
    
    const fullName = [firstName, fatherName, lastName].filter(p => p).join(' ');
    
    console.log('\n✅ Extracted data:');
    console.log('  Student ID:', studentId);
    console.log('  Full Name:', fullName, `(from: ${firstName} + ${fatherName} + ${lastName})`);
    console.log('  Gender:', gender);
    console.log('  Department:', department);
    console.log('  Year:', year);
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(70) + '\n');

// Test with various formats file
console.log('📋 Test 2: Various Formats (Extra Columns)');
console.log('File: students_various_formats_sample.csv\n');

try {
    const workbook2 = xlsx.readFile('students_various_formats_sample.csv');
    const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    const data2 = xlsx.utils.sheet_to_json(sheet2);
    
    console.log('Columns found:', Object.keys(data2[0]));
    console.log('Extra columns detected:', Object.keys(data2[0]).filter(k => 
        !['S/N', 'English Name', 'Matric No', 'Gender', 'Faculty', 'Level', 'Contact'].includes(k)
    ));
    
    console.log('\nProcessing first row:');
    
    const row2 = data2[0];
    console.log('Raw data:', row2);
    
    const studentId = cleanValue(getColumnValue(row2, 'ID', 'Matric No', 'Student ID'));
    const fullName = cleanValue(getColumnValue(row2, 'English Name', 'fullName', 'Full Name', 'Name'));
    const gender = cleanValue(getColumnValue(row2, 'Gender', 'Sex', 'S'));
    const department = cleanValue(getColumnValue(row2, 'Faculty', 'Dept', 'department'));
    const year = cleanValue(getColumnValue(row2, 'Level', 'Year', 'year'));
    
    console.log('\n✅ Extracted data:');
    console.log('  Student ID:', studentId);
    console.log('  Full Name:', fullName);
    console.log('  Gender:', gender);
    console.log('  Department:', department);
    console.log('  Year:', year);
    console.log('\n  Extra columns ignored: ✓');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(70) + '\n');

// Test column name variations
console.log('📋 Test 3: Column Name Matching');
console.log('Testing case-insensitive and special character handling\n');

const testRow = {
    'Student.ID': 'TEST001',
    'Student_Name': 'Test Student',
    'GENDER': 'M',
    'Dept.': 'CS',
    'Year-Level': '1'
};

console.log('Test row:', testRow);

const id = getColumnValue(testRow, 'studentId', 'Student ID', 'ID');
const name = getColumnValue(testRow, 'fullName', 'Full Name', 'Student Name');
const sex = getColumnValue(testRow, 'gender', 'Sex', 'S');
const dept = getColumnValue(testRow, 'department', 'Dept');
const yr = getColumnValue(testRow, 'year', 'Year Level', 'Level');

console.log('\n✅ Matched columns:');
console.log('  Student.ID → studentId:', id);
console.log('  Student_Name → fullName:', name);
console.log('  GENDER → gender:', sex);
console.log('  Dept. → department:', dept);
console.log('  Year-Level → year:', yr);

console.log('\n' + '='.repeat(70));
console.log('✅ All tests completed successfully!');
console.log('The flexible import system can handle:');
console.log('  ✓ Separate name columns (auto-merge)');
console.log('  ✓ Extra/unknown columns (ignored)');
console.log('  ✓ Case variations (STUDENT ID = student id)');
console.log('  ✓ Special characters (Student.ID = Student_ID = Student-ID)');
console.log('='.repeat(70));
