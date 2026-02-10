const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/Admin');
const Proctor = require('./models/Proctor');
const Maintainer = require('./models/Maintainer');

const unlockAllAccounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        console.log('🔓 Unlocking all accounts...\n');

        // Unlock all admins
        const adminResult = await Admin.updateMany(
            {},
            {
                $set: { failedLoginAttempts: 0 },
                $unset: { accountLockedUntil: 1 }
            }
        );
        console.log(`✅ Unlocked ${adminResult.modifiedCount} admin accounts`);

        // Unlock all proctors
        const proctorResult = await Proctor.updateMany(
            {},
            {
                $set: { failedLoginAttempts: 0 },
                $unset: { accountLockedUntil: 1 }
            }
        );
        console.log(`✅ Unlocked ${proctorResult.modifiedCount} proctor accounts`);

        // Unlock all maintainers
        const maintainerResult = await Maintainer.updateMany(
            {},
            {
                $set: { failedLoginAttempts: 0 },
                $unset: { accountLockedUntil: 1 }
            }
        );
        console.log(`✅ Unlocked ${maintainerResult.modifiedCount} maintainer accounts`);

        console.log('\n🎉 All accounts unlocked successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

unlockAllAccounts();
