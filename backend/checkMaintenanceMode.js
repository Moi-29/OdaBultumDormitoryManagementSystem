const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const SystemSettings = require('./models/SystemSettings');

const checkAndDisableMaintenanceMode = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        const settings = await SystemSettings.findOne();
        
        if (!settings) {
            console.log('⚠️  No system settings found');
            process.exit(0);
        }

        console.log('📋 Current System Settings:');
        console.log(`   Maintenance Mode: ${settings.maintenanceMode ? '🔴 ENABLED' : '🟢 DISABLED'}`);
        console.log(`   Max Students Per Room: ${settings.maxStudentsPerRoom}`);
        console.log(`   Allow Student Registration: ${settings.allowStudentRegistration}`);

        if (settings.maintenanceMode) {
            console.log('\n🔧 Disabling maintenance mode...');
            settings.maintenanceMode = false;
            await settings.save();
            console.log('✅ Maintenance mode DISABLED!');
        } else {
            console.log('\n✅ Maintenance mode is already disabled');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAndDisableMaintenanceMode();
