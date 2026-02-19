const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HomeContent = require('./models/HomeContent');
const connectDB = require('./config/db');

dotenv.config();

// NOTE: These image paths will need to be updated to actual URLs after uploading to Cloudinary
// For now, using placeholder paths that match the frontend asset structure
const existingLeaders = [
    {
        name: "Prof. Muktar Mohammed",
        position: "President",
        description: "Prof. Muktar Mohammed serves as the President of Oda Bultum University, bringing visionary leadership and transformative academic excellence to the institution. With extensive experience in higher education administration and a deep commitment to educational innovation, he orchestrates strategic governance that positions the university as a beacon of knowledge and community development. His leadership philosophy centers on fostering academic excellence, promoting research innovation, and ensuring equitable access to quality education. Under his stewardship, the university has expanded its academic programs, strengthened research capacity, and deepened community partnerships. His mission is to cultivate a learning environment that empowers students to become ethical leaders and change-makers. With unwavering dedication to institutional integrity and student success, he guides the university toward achieving international recognition while remaining deeply rooted in serving local and regional development needs. His vision encompasses building a world-class institution that combines academic rigor with social responsibility.",
        image: "https://via.placeholder.com/400x400?text=Prof.+Muktar+Mohammed", // Replace with actual Cloudinary URL after upload
        order: 0
    },
    {
        name: "Mr. Ibsa Ahmed",
        position: "Vice President for Administration and Development",
        description: "Mr. Ibsa Ahmed serves as Vice President for Administration and Development, overseeing the comprehensive management of institutional infrastructure, resource allocation, and developmental initiatives. His strategic approach to administrative excellence has transformed the university's operational efficiency and sustainability. With exceptional skills in financial management, infrastructure planning, and human resource development, he ensures that all university facilities and services operate at optimal levels. His leadership is characterized by transparency, accountability, and innovative problem-solving. He recognizes that strong administrative foundations are essential for academic excellence and works tirelessly to create an enabling environment for teaching, learning, and research. Under his guidance, the university has modernized its administrative systems, improved resource utilization, and enhanced service delivery to all stakeholders.",
        image: "https://via.placeholder.com/400x400?text=Mr.+Ibsa+Ahmed", // Replace with actual Cloudinary URL after upload
        order: 1
    },
    {
        name: "Alemayehu Bayene (Assist. Professor)",
        position: "Vice President for Academic, Research, Technology Transfer and Community",
        description: "Assist. Professor Alemayehu Bayene leads the academic, research, and community engagement portfolios with scholarly distinction and innovative vision. His multifaceted role encompasses curriculum development, research promotion, technology transfer, and community partnership building. With strong academic credentials and practical experience in bridging theory and practice, he champions the integration of cutting-edge research with community needs. His leadership skills include strategic planning, stakeholder engagement, and fostering interdisciplinary collaboration. He is passionate about knowledge creation and social impact, working to ensure that university research addresses real-world challenges and contributes to sustainable development. His vision includes building robust research infrastructure, promoting faculty scholarship, and establishing meaningful partnerships with industry and community organizations.",
        image: "https://via.placeholder.com/400x400?text=Alemayehu+Bayene", // Replace with actual Cloudinary URL after upload
        order: 2
    },
    {
        name: "Mr. Lelisa Shamsedin",
        position: "Student Service Directorate",
        description: "Mr. Lelisa Shamsedin heads the Student Service Directorate with unwavering commitment to holistic student development and welfare. His comprehensive approach to student services encompasses accommodation, counseling, health services, recreational facilities, and student advocacy. With exceptional interpersonal skills and deep understanding of student needs, he creates support systems that enable students to thrive academically, socially, and personally. His leadership is marked by accessibility, empathy, and proactive problem-solving. He believes that student success extends beyond academics and works to foster resilience, mental health, and personal growth. Under his direction, the directorate has implemented innovative programs that address diverse student needs, promote campus safety, and enhance the overall student experience.",
        image: "https://via.placeholder.com/400x400?text=Mr.+Lelisa+Shamsedin", // Replace with actual Cloudinary URL after upload
        order: 3
    },
    {
        name: "Mr. Ararsa Gudisa",
        position: "Director, University Registrar",
        description: "Mr. Ararsa Gudisa serves as Director of the University Registrar with meticulous attention to detail and commitment to academic record integrity. His comprehensive responsibilities include student admissions, registration management, academic record keeping, transcript processing, and graduation certification. With exceptional organizational skills and deep understanding of academic regulations, he ensures that all registration functions operate with accuracy and efficiency. His leadership is characterized by precision, confidentiality, and student-centered service delivery. He is committed to institutional integrity and student success, implementing initiatives that streamline academic processes, enhance data security, and improve service accessibility. His vision includes modernizing registration systems, ensuring compliance with academic standards, and providing seamless support for students throughout their academic journey.",
        image: "https://via.placeholder.com/400x400?text=Mr.+Ararsa+Gudisa", // Replace with actual Cloudinary URL after upload
        order: 4
    },
    {
        name: "Ahmedin Abdurahman (PhD)",
        position: "Director, Quality Assurance Directorate",
        description: "Dr. Ahmedin Abdurahman leads the Quality Assurance Directorate with scholarly rigor and unwavering commitment to institutional excellence. His comprehensive approach to quality management encompasses program review, accreditation processes, performance monitoring, and continuous improvement initiatives. With expertise in quality assurance frameworks and assessment methodologies, he establishes systems that ensure the university maintains the highest academic standards. His leadership skills include data analysis, stakeholder consultation, and strategic quality planning. He is passionate about academic integrity and institutional reputation, working to embed quality culture across all university operations. His vision includes achieving national and international accreditation, enhancing program quality, and positioning the university as a leader in quality assurance practices.",
        image: "https://via.placeholder.com/400x400?text=Dr.+Ahmedin+Abdurahman", // Replace with actual Cloudinary URL after upload
        order: 5
    },
    {
        name: "Getachew Gashaw (Assist. Professor)",
        position: "Director, Academic Program and Staff Development Directorate",
        description: "Assist. Professor Getachew Gashaw directs the Academic Program and Staff Development Directorate with scholarly expertise and commitment to pedagogical excellence. His role encompasses curriculum design, program evaluation, faculty development, and quality enhancement of teaching and learning. With strong academic background and understanding of contemporary educational trends, he leads initiatives that ensure academic programs are relevant, rigorous, and responsive to societal needs. His skills include instructional design, assessment methodology, and professional development facilitation. He is passionate about teaching innovation and faculty empowerment, working to create a culture of continuous learning and pedagogical excellence. His vision includes developing world-class academic programs, enhancing teaching quality, and building faculty capacity for educational leadership.",
        image: "https://via.placeholder.com/400x400?text=Getachew+Gashaw", // Replace with actual Cloudinary URL after upload
        order: 6
    }
];

const seedHomeContent = async () => {
    try {
        await connectDB();
        
        console.log('🌱 Starting home content seeding...');
        
        // Check if content already exists
        const existingContent = await HomeContent.findOne();
        
        if (existingContent) {
            console.log('⚠️  Home content already exists in database');
            console.log('📊 Current content:');
            console.log('   - Hero Title:', existingContent.heroTitle);
            console.log('   - Leaders:', existingContent.leaders.length);
            
            // Ask if user wants to update
            console.log('\n❓ To update existing content, delete the current document first');
            console.log('   Run: db.homecontents.deleteMany({}) in MongoDB');
            process.exit(0);
        }
        
        // Create new content with existing data
        const homeContent = await HomeContent.create({
            heroTitle: 'Welcome to Oda Bultum University',
            heroSubtitle: 'Dormitory Management System',
            heroDescription: 'Find your dormitory placement, apply for accommodation, and manage your student housing needs all in one place.',
            heroImage: '/images/Hero-Section.jpg',
            leadershipTitle: 'University Leadership',
            leadershipDescription: 'Meet the dedicated leaders who guide Oda Bultum University towards excellence in education, research, and community service.',
            leaders: existingLeaders
        });
        
        console.log('✅ Home content seeded successfully!');
        console.log('📊 Seeded data:');
        console.log('   - Hero Title:', homeContent.heroTitle);
        console.log('   - Hero Subtitle:', homeContent.heroSubtitle);
        console.log('   - Leadership Title:', homeContent.leadershipTitle);
        console.log('   - Leaders added:', homeContent.leaders.length);
        console.log('\n👥 Leaders:');
        homeContent.leaders.forEach((leader, index) => {
            console.log(`   ${index + 1}. ${leader.name} - ${leader.position}`);
        });
        
        console.log('\n📸 IMPORTANT - Image Upload Required:');
        console.log('   The seeder uses placeholder images. To use actual leader photos:');
        console.log('   1. Login to Admin Dashboard');
        console.log('   2. Go to Home Content → Leadership Section');
        console.log('   3. Click "Edit" on each leader');
        console.log('   4. Upload their actual photo from your assets folder:');
        console.log('      - Prof. Muktar: frontend/src/assets/one.jpg');
        console.log('      - Mr. Ibsa: frontend/src/assets/two.jpg');
        console.log('      - Alemayehu: frontend/src/assets/threes.jpg');
        console.log('      - Mr. Lelisa: frontend/src/assets/four.jpg');
        console.log('      - Mr. Ararsa: frontend/src/assets/sevens.jpg');
        console.log('      - Dr. Ahmedin: frontend/src/assets/sixs.jpg');
        console.log('      - Getachew: frontend/src/assets/fives.jpg');
        console.log('   5. For Hero Section: Upload frontend/src/assets/Hero-Section.jpg');
        console.log('\n   Images will be automatically uploaded to Cloudinary!');
        
        console.log('\n🎉 Seeding completed! You can now manage this content from the admin dashboard.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding home content:', error);
        process.exit(1);
    }
};

seedHomeContent();
