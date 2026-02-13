const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const Admin = require('./models/Admin');
const User = require('./models/User');

const checkAdmins = async () => {
    try {
        console.log('Checking Admin collection...');
        const adminCount = await Admin.countDocuments();
        console.log(`Total admins in Admin collection: ${adminCount}`);
        
        if (adminCount > 0) {
            const admins = await Admin.find().select('username email role status');
            console.log('\nAdmins:');
            admins.forEach((admin, index) => {
                console.log(`${index + 1}. Username: ${admin.username}, Email: ${admin.email}, Role: ${admin.role}, Status: ${admin.status}`);
            });
        }
        
        console.log('\n---\n');
        console.log('Checking User collection...');
        const userCount = await User.countDocuments({ role: 'admin' });
        console.log(`Total admins in User collection: ${userCount}`);
        
        if (userCount > 0) {
            const users = await User.find({ role: 'admin' }).select('username email role status');
            console.log('\nAdmin Users:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmins();
