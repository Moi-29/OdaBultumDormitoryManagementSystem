const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const dropEmailIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        const db = mongoose.connection.db;
        
        // Drop email index from admins collection
        try {
            await db.collection('admins').dropIndex('email_1');
            console.log('✅ Dropped email_1 index from admins collection');
        } catch (error) {
            if (error.code === 27) {
                console.log('⚠️  email_1 index does not exist (already dropped)');
            } else {
                throw error;
            }
        }

        // List remaining indexes
        const indexes = await db.collection('admins').indexes();
        console.log('\n📋 Remaining indexes on admins collection:');
        indexes.forEach(index => {
            console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
        });

        console.log('\n✅ Index cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

dropEmailIndex();
