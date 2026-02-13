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

const resetPassword = async () => {
    try {
        const username = 'admin';
        const newPassword = 'admin123';
        
        console.log(`Resetting password for username: ${username}`);
        console.log(`New password: ${newPassword}`);
        console.log('---');
        
        // Find admin
        const admin = await Admin.findOne({ username: username.toLowerCase() });
        
        if (!admin) {
            console.log('❌ Admin not found');
            process.exit(1);
        }
        
        console.log('✓ Admin found');
        console.log(`  Username: ${admin.username}`);
        console.log(`  Full Name: ${admin.fullName}`);
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        console.log('---');
        console.log('Hashing new password...');
        console.log(`  Salt: ${salt}`);
        console.log(`  Hashed: ${hashedPassword.substring(0, 30)}...`);
        
        // Update password directly
        admin.password = hashedPassword;
        await admin.save();
        
        console.log('---');
        console.log('✓ Password updated successfully!');
        console.log('---');
        
        // Verify the new password
        console.log('Verifying new password...');
        const updatedAdmin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
        const isValid = await bcrypt.compare(newPassword, updatedAdmin.password);
        console.log(`  Result: ${isValid ? '✓ Password verification successful' : '❌ Password verification failed'}`);
        
        console.log('---');
        console.log('Login credentials:');
        console.log(`  Username: ${username}`);
        console.log(`  Password: ${newPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
