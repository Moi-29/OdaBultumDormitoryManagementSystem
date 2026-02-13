const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const Request = require('./models/Request');
const Message = require('./models/Message');

const deleteAllRequests = async () => {
    try {
        console.log('WARNING: This will delete ALL requests and messages from the database!');
        console.log('Starting deletion in 3 seconds... Press Ctrl+C to cancel');
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Delete all messages
        const messagesResult = await Message.deleteMany({});
        console.log(`Deleted ${messagesResult.deletedCount} messages`);
        
        // Delete all requests
        const requestsResult = await Request.deleteMany({});
        console.log(`Deleted ${requestsResult.deletedCount} requests`);
        
        console.log('\nAll requests and messages have been deleted successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteAllRequests();
