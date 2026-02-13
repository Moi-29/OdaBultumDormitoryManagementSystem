const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const Request = require('./models/Request');

const checkRequests = async () => {
    try {
        const count = await Request.countDocuments();
        console.log('Total requests in database:', count);
        
        const requests = await Request.find().select('subject isRead fromUserModel');
        console.log('\nRequests:');
        requests.forEach((req, index) => {
            console.log(`${index + 1}. ${req.subject} - isRead: ${req.isRead} - from: ${req.fromUserModel}`);
        });
        
        const unreadCount = await Request.countDocuments({ isRead: false });
        console.log(`\nUnread requests: ${unreadCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkRequests();
