// Script to fix user status from 'Active' to 'active'
require('dotenv').config();
const mongoose = require('mongoose');
const Proctor = require('./models/Proctor');
const Maintainer = require('./models/Maintainer');

const fixUserStatus = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Update all proctors with 'Active' status to 'active'
        const proctorResult = await Proctor.updateMany(
            { status: 'Active' },
            { $set: { status: 'active' } }
        );
        console.log(`✅ Updated ${proctorResult.modifiedCount} proctors`);

        // Update all proctors with 'Inactive' status to 'inactive'
        const proctorInactiveResult = await Proctor.updateMany(
            { status: 'Inactive' },
            { $set: { status: 'inactive' } }
        );
        console.log(`✅ Updated ${proctorInactiveResult.modifiedCount} inactive proctors`);

        // Update all maintainers with 'Active' status to 'active'
        const maintainerResult = await Maintainer.updateMany(
            { status: 'Active' },
            { $set: { status: 'active' } }
        );
        console.log(`✅ Updated ${maintainerResult.modifiedCount} maintainers`);

        // Update all maintainers with 'Inactive' status to 'inactive'
        const maintainerInactiveResult = await Maintainer.updateMany(
            { status: 'Inactive' },
            { $set: { status: 'inactive' } }
        );
        console.log(`✅ Updated ${maintainerInactiveResult.modifiedCount} inactive maintainers`);

        // List all proctors
        const proctors = await Proctor.find().select('username status');
        console.log('\n📋 All Proctors:');
        proctors.forEach(p => console.log(`  - ${p.username}: ${p.status}`));

        // List all maintainers
        const maintainers = await Maintainer.find().select('username status');
        console.log('\n📋 All Maintainers:');
        maintainers.forEach(m => console.log(`  - ${m.username}: ${m.status}`));

        console.log('\n✅ Status fix completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixUserStatus();
