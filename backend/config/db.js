const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/obudms');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);

        // Only fallback to portable DB if we are using localhost and it failed
        // For remote DBs, we want to know if it fails!
        if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('localhost') || process.env.MONGO_URI.includes('127.0.0.1')) {
            console.log('⚠️ Could not connect to local MongoDB. Attempting to start Portable MongoDB...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();

                console.log(`✨ Portable MongoDB started at: ${uri}`);

                const conn = await mongoose.connect(uri);
                console.log(`✅ Portable MongoDB Connected: ${conn.connection.host}`);

                // Re-seed data since this is a fresh memory instance
                const seeder = require('../seeder');
                console.log('🌱 Seeding portable database...');
                await seeder(false); // false = do not exit process

                console.log('✅ Portable Database Ready!');
            } catch (memError) {
                console.error(`Error: ${error.message}`);
                console.error(`Portable DB Error: ${memError.message}`);
                process.exit(1);
            }
        } else {
            // Remote DB connection failed - Exit process
            console.error('❌ Failed to connect to remote MongoDB. Check your internet connection and IP whitelist.');
            process.exit(1);
        }
    }
};

module.exports = connectDB;
