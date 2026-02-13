const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const Request = require('./models/Request');

const migrateRequests = async () => {
    try {
        console.log('Starting migration: Adding isRead field to existing requests...');
        
        // Update all requests that don't have isRead field or have it as undefined
        const result = await Request.updateMany(
            { 
                $or: [
                    { isRead: { $exists: false } },
                    { isRead: null }
                ]
            },
            { 
                $set: { isRead: false } 
            }
        );
        
        console.log(`Migration completed successfully!`);
        console.log(`Updated ${result.modifiedCount} requests with isRead: false`);
        
        // Verify the migration
        const totalRequests = await Request.countDocuments();
        const unreadRequests = await Request.countDocuments({ isRead: false });
        const readRequests = await Request.countDocuments({ isRead: true });
        
        console.log('\nVerification:');
        console.log(`Total requests: ${totalRequests}`);
        console.log(`Unread requests: ${unreadRequests}`);
        console.log(`Read requests: ${readRequests}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateRequests();
