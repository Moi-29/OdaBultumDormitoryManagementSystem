const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const Admin = require('./models/Admin');

const testLogin = async () => {
    try {
        const username = 'admin';
        const password = 'admin123';
        
        console.log(`Testing login for username: ${username}`);
        console.log(`Password: ${password}`);
        console.log('---');
        
        // Find admin
        const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
        
        if (!admin) {
            console.log('❌ Admin not found');
            process.exit(1);
        }
        
        console.log('✓ Admin found');
        console.log(`  Username: ${admin.username}`);
        console.log(`  Full Name: ${admin.fullName}`);
        console.log(`  Status: ${admin.status}`);
        console.log(`  Has password field: ${!!admin.password}`);
        console.log(`  Password hash: ${admin.password ? admin.password.substring(0, 20) + '...' : 'N/A'}`);
        console.log('---');
        
        // Test password comparison
        if (admin.comparePassword) {
            console.log('Testing password with comparePassword method...');
            const isValid = await admin.comparePassword(password);
            console.log(`  Result: ${isValid ? '✓ Password matches' : '❌ Password does not match'}`);
        } else {
            console.log('❌ comparePassword method not found on admin model');
        }
        
        // Manual bcrypt test
        console.log('---');
        console.log('Testing with manual bcrypt comparison...');
        const manualTest = await bcrypt.compare(password, admin.password);
        console.log(`  Result: ${manualTest ? '✓ Password matches' : '❌ Password does not match'}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testLogin();
