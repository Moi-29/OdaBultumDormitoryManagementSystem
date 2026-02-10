const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/Admin');
const Proctor = require('./models/Proctor');
const Maintainer = require('./models/Maintainer');

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        // Check Admins
        const admins = await Admin.find().select('username fullName status');
        console.log('📋 ADMINS:');
        if (admins.length === 0) {
            console.log('   ⚠️  No admins found in database!');
        } else {
            admins.forEach(admin => {
                console.log(`   - ${admin.username} (${admin.fullName}) - Status: ${admin.status}`);
            });
        }

        // Check Proctors
        const proctors = await Proctor.find().select('username fullName blockId status');
        console.log('\n📋 PROCTORS:');
        if (proctors.length === 0) {
            console.log('   ⚠️  No proctors found in database!');
        } else {
            proctors.forEach(proctor => {
                console.log(`   - ${proctor.username} (${proctor.fullName}) - Block: ${proctor.blockId} - Status: ${proctor.status}`);
            });
        }

        // Check Maintainers
        const maintainers = await Maintainer.find().select('username fullName specialization status');
        console.log('\n📋 MAINTAINERS:');
        if (maintainers.length === 0) {
            console.log('   ⚠️  No maintainers found in database!');
        } else {
            maintainers.forEach(maintainer => {
                console.log(`   - ${maintainer.username} (${maintainer.fullName}) - Specialization: ${maintainer.specialization} - Status: ${maintainer.status}`);
            });
        }

        console.log('\n✅ Check complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkUsers();
