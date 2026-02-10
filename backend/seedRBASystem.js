const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Block = require('./models/Block');
const Proctor = require('./models/Proctor');
const Maintainer = require('./models/Maintainer');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const seedBlocks = async () => {
    try {
        // Clear existing blocks
        await Block.deleteMany({});
        console.log('🗑️  Cleared existing blocks');

        // Create blocks
        const blocks = [
            {
                name: 'Block A',
                description: 'Male dormitory - Ground floor',
                gender: 'male',
                totalRooms: 50,
                capacity: 200,
                currentOccupancy: 180,
                status: 'active'
            },
            {
                name: 'Block B',
                description: 'Male dormitory - First floor',
                gender: 'male',
                totalRooms: 50,
                capacity: 200,
                currentOccupancy: 195,
                status: 'active'
            },
            {
                name: 'Block C',
                description: 'Female dormitory - Ground floor',
                gender: 'female',
                totalRooms: 45,
                capacity: 180,
                currentOccupancy: 165,
                status: 'active'
            },
            {
                name: 'Block D',
                description: 'Female dormitory - First floor',
                gender: 'female',
                totalRooms: 45,
                capacity: 180,
                currentOccupancy: 170,
                status: 'active'
            },
            {
                name: 'Block E',
                description: 'Mixed dormitory - Graduate students',
                gender: 'mixed',
                totalRooms: 30,
                capacity: 120,
                currentOccupancy: 100,
                status: 'active'
            },
            {
                name: 'Block F',
                description: 'Male dormitory - Under maintenance',
                gender: 'male',
                totalRooms: 40,
                capacity: 160,
                currentOccupancy: 0,
                status: 'maintenance'
            }
        ];

        const createdBlocks = await Block.insertMany(blocks);
        console.log(`✅ Created ${createdBlocks.length} blocks`);
        return createdBlocks;
    } catch (error) {
        console.error('❌ Error seeding blocks:', error);
        throw error;
    }
};

const seedProctors = async (blocks) => {
    try {
        // Clear existing proctors
        await Proctor.deleteMany({});
        console.log('🗑️  Cleared existing proctors');

        // Create proctors
        const proctors = [
            {
                fullName: 'John Doe',
                username: 'proctor_blocka',
                password: 'password123',
                phone: '+251911111111',
                email: 'proctor.blocka@obu.edu.et',
                blockId: 'Block A',
                status: 'active'
            },
            {
                fullName: 'Jane Smith',
                username: 'proctor_blockb',
                password: 'password123',
                phone: '+251922222222',
                email: 'proctor.blockb@obu.edu.et',
                blockId: 'Block B',
                status: 'active'
            },
            {
                fullName: 'Sarah Johnson',
                username: 'proctor_blockc',
                password: 'password123',
                phone: '+251933333333',
                email: 'proctor.blockc@obu.edu.et',
                blockId: 'Block C',
                status: 'active'
            },
            {
                fullName: 'Emily Brown',
                username: 'proctor_blockd',
                password: 'password123',
                phone: '+251944444444',
                email: 'proctor.blockd@obu.edu.et',
                blockId: 'Block D',
                status: 'active'
            },
            {
                fullName: 'Michael Wilson',
                username: 'proctor_blocke',
                password: 'password123',
                phone: '+251955555555',
                email: 'proctor.blocke@obu.edu.et',
                blockId: 'Block E',
                status: 'active'
            }
        ];

        const createdProctors = await Proctor.insertMany(proctors);
        console.log(`✅ Created ${createdProctors.length} proctors`);

        // Update blocks with assigned proctors
        for (let i = 0; i < createdProctors.length; i++) {
            const block = blocks.find(b => b.name === createdProctors[i].blockId);
            if (block) {
                block.assignedProctor = createdProctors[i]._id;
                await block.save();
            }
        }
        console.log('✅ Updated blocks with assigned proctors');

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

        console.log('\n🌱 Starting RBA System Seeding...\n');

        const blocks = await seedBlocks();
        const proctors = await seedProctors(blocks);
        const maintainers = await seedMaintainers();

        console.log('\n✅ RBA System Seeding Complete!\n');
        console.log('📋 Summary:');
        console.log(`   - Blocks: ${blocks.length}`);
        console.log(`   - Proctors: ${proctors.length}`);
        console.log(`   - Maintainers: ${maintainers.length}`);
        console.log('\n🔐 Test Credentials:');
        console.log('   Proctor (Block A): username: proctor_blocka, password: password123');
        console.log('   Proctor (Block B): username: proctor_blockb, password: password123');
        console.log('   Maintainer (Plumbing): username: maintainer_plumbing, password: password123');
        console.log('   Maintainer (Electrical): username: maintainer_electrical, password: password123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder
seedAll();
