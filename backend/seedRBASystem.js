const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Room = require('./models/Room');
const Proctor = require('./models/Proctor');
const Maintainer = require('./models/Maintainer');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const getAvailableBlocks = async () => {
    try {
        // Get unique buildings (blocks) from Room collection - REAL DATA
        const rooms = await Room.find().select('building gender');
        
        if (rooms.length === 0) {
            console.log('⚠️  No rooms found in database. Please add rooms in the Dormitories section first.');
            return [];
        }

        // Group by building to get unique blocks
        const blockMap = new Map();
        rooms.forEach(room => {
            if (!blockMap.has(room.building)) {
                blockMap.set(room.building, {
                    name: room.building,
                    gender: room.gender
                });
            }
        });
        
        const blocks = Array.from(blockMap.values()).sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        console.log(`✅ Found ${blocks.length} real blocks from Dormitories:`);
        blocks.forEach(block => {
            console.log(`   - ${block.name} (${block.gender === 'M' ? 'Male' : 'Female'})`);
        });

        return blocks;
    } catch (error) {
        console.error('❌ Error fetching blocks:', error);
        throw error;
    }
};

const seedProctors = async (blocks) => {
    try {
        if (blocks.length === 0) {
            console.log('⚠️  No blocks available. Skipping proctor seeding.');
            return [];
        }

        // Clear existing proctors
        await Proctor.deleteMany({});
        console.log('🗑️  Cleared existing proctors');

        // Create proctors for available blocks (up to 5)
        const proctorData = [
            { fullName: 'John Doe', username: 'proctor_', phone: '+251911111111', email: 'proctor1@obu.edu.et' },
            { fullName: 'Jane Smith', username: 'proctor_', phone: '+251922222222', email: 'proctor2@obu.edu.et' },
            { fullName: 'Sarah Johnson', username: 'proctor_', phone: '+251933333333', email: 'proctor3@obu.edu.et' },
            { fullName: 'Emily Brown', username: 'proctor_', phone: '+251944444444', email: 'proctor4@obu.edu.et' },
            { fullName: 'Michael Wilson', username: 'proctor_', phone: '+251955555555', email: 'proctor5@obu.edu.et' }
        ];

        const proctors = [];
        const maxProctors = Math.min(blocks.length, proctorData.length);

        for (let i = 0; i < maxProctors; i++) {
            const block = blocks[i];
            const data = proctorData[i];
            
            proctors.push({
                fullName: data.fullName,
                username: `${data.username}${block.name.toLowerCase().replace(/\s+/g, '')}`,
                password: 'password123',
                phone: data.phone,
                email: data.email,
                blockId: block.name,
                status: 'active'
            });
        }

        const createdProctors = await Proctor.insertMany(proctors);
        console.log(`✅ Created ${createdProctors.length} proctors`);

        return createdProctors;
    } catch (error) {
        console.error('❌ Error seeding proctors:', error);
        throw error;
    }
};

const seedMaintainers = async () => {
    try {
        // Clear existing maintainers
        await Maintainer.deleteMany({});
        console.log('🗑️  Cleared existing maintainers');

        // Create maintainers
        const maintainers = [
            {
                fullName: 'David Martinez',
                username: 'maintainer_plumbing',
                password: 'password123',
                phone: '+251966666666',
                email: 'plumbing@obu.edu.et',
                specialization: 'plumbing',
                status: 'active'
            },
            {
                fullName: 'Robert Garcia',
                username: 'maintainer_electrical',
                password: 'password123',
                phone: '+251977777777',
                email: 'electrical@obu.edu.et',
                specialization: 'electrical',
                status: 'active'
            },
            {
                fullName: 'James Rodriguez',
                username: 'maintainer_carpentry',
                password: 'password123',
                phone: '+251988888888',
                email: 'carpentry@obu.edu.et',
                specialization: 'carpentry',
                status: 'active'
            },
            {
                fullName: 'William Lee',
                username: 'maintainer_general',
                password: 'password123',
                phone: '+251999999999',
                email: 'general@obu.edu.et',
                specialization: 'general',
                status: 'active'
            },
            {
                fullName: 'Thomas Anderson',
                username: 'maintainer_hvac',
                password: 'password123',
                phone: '+251900000000',
                email: 'hvac@obu.edu.et',
                specialization: 'hvac',
                status: 'active'
            }
        ];

        const createdMaintainers = await Maintainer.insertMany(maintainers);
        console.log(`✅ Created ${createdMaintainers.length} maintainers`);

        return createdMaintainers;
    } catch (error) {
        console.error('❌ Error seeding maintainers:', error);
        throw error;
    }
};

const seedAll = async () => {
    try {
        await connectDB();

        console.log('\n🌱 Starting RBA System Seeding (Using Real Blocks from Dormitories)...\n');

        const blocks = await getAvailableBlocks();
        
        if (blocks.length === 0) {
            console.log('\n⚠️  WARNING: No blocks found!');
            console.log('   Please add rooms in the Admin Dashboard > Dormitories section first.');
            console.log('   Then run this seeder again to create proctors for those blocks.\n');
            process.exit(1);
        }

        const proctors = await seedProctors(blocks);
        const maintainers = await seedMaintainers();

        console.log('\n✅ RBA System Seeding Complete!\n');
        console.log('📋 Summary:');
        console.log(`   - Real Blocks (from Dormitories): ${blocks.length}`);
        console.log(`   - Proctors: ${proctors.length}`);
        console.log(`   - Maintainers: ${maintainers.length}`);
        console.log('\n🔐 Test Credentials:');
        
        if (proctors.length > 0) {
            console.log('   Proctors:');
            proctors.forEach(p => {
                console.log(`     - ${p.blockId}: username: ${p.username}, password: password123`);
            });
        }
        
        console.log('   Maintainers:');
        console.log('     - Plumbing: username: maintainer_plumbing, password: password123');
        console.log('     - Electrical: username: maintainer_electrical, password: password123');
        console.log('     - Carpentry: username: maintainer_carpentry, password: password123');
        console.log('     - General: username: maintainer_general, password: password123');
        console.log('     - HVAC: username: maintainer_hvac, password: password123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder
seedAll();
