const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Proctor = require('./models/Proctor');

const testProctorLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        const username = 'proctor_amal-2a';
        const password = 'password123';

        const proctor = await Proctor.findOne({ username }).select('+password');
        
        if (!proctor) {
            console.log('❌ Proctor not found');
            process.exit(1);
        }

        console.log('✅ Proctor found:', proctor.username);
        console.log('Status:', proctor.status);
        console.log('Failed attempts:', proctor.failedLoginAttempts);
        console.log('Account locked until:', proctor.accountLockedUntil);
        console.log('Is locked:', proctor.isAccountLocked());

        const isValid = await proctor.comparePassword(password);
        console.log('\n🔐 Password valid:', isValid);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testProctorLogin();
