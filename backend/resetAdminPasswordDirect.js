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
        
        // Hash the password manually
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        console.log('Password hashed successfully');
        console.log(`  Hash: ${hashedPassword.substring(0, 30)}...`);
        console.log('---');
        
        // Update directly using updateOne to bypass pre-save hook
        const result = await Admin.updateOne(
            { username: username.toLowerCase() },
            { 
                $set: { 
                    password: hashedPassword,
                    passwordChangedAt: new Date(),
                    failedLoginAttempts: 0
                },
                $unset: { accountLockedUntil: 1 }
            }
        );
        
        if (result.matchedCount === 0) {
            console.log('❌ Admin not found');
            process.exit(1);
        }
        
        console.log('✓ Password updated successfully!');
        console.log(`  Matched: ${result.matchedCount}`);
        console.log(`  Modified: ${result.modifiedCount}`);
        console.log('---');
        
        // Verify the new password
        console.log('Verifying new password...');
        const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
        const isValid = await bcrypt.compare(newPassword, admin.password);
        console.log(`  Result: ${isValid ? '✓ Password verification successful!' : '❌ Password verification failed'}`);
        
        if (isValid) {
            console.log('---');
            console.log('✅ SUCCESS! You can now login with:');
            console.log(`  Username: ${username}`);
            console.log(`  Password: ${newPassword}`);
            console.log(`  Role: admin`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetPassword();
