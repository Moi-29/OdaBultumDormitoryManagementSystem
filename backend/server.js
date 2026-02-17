const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression'); // ⚡ PERFORMANCE: Response compression
const connectDB = require('./config/db');
const { initRedis } = require('./utils/cache'); // ⚡ PERFORMANCE: Redis caching

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.MONGO_URI) {
    console.error('❌ FATAL ERROR: MONGO_URI is not defined in environment variables');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('📍 PORT:', process.env.PORT || 5000);
console.log('📍 MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ Missing');
console.log('📍 JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('📍 ALLOWED_ORIGIN:', process.env.ALLOWED_ORIGIN || 'Not set (will allow all in dev)');

const app = express();

// ⚡ PERFORMANCE MIDDLEWARE - Enable GZIP/Brotli compression
app.use(compression({
    level: 6, // Compression level (0-9)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Middleware
// CORS Configuration - supports both development and production
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.ALLOWED_ORIGIN || 'https://obudms.vercel.app',
        'https://obudms.vercel.app',
        'https://odabultumdormitorymanagementsystem.onrender.com'
      ]
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];

console.log('🌐 CORS allowed origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl requests)
        if (!origin) {
            console.log('✓ Request with no origin allowed');
            return callback(null, true);
        }
        
        console.log('🔍 Checking origin:', origin);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            console.log('✓ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('✗ Origin blocked:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection and Auto-seed
const initializeDatabase = async () => {
    try {
        console.log('🔄 Initializing database connection...');
        await connectDB();
        console.log('✅ Database connected successfully');
        
        console.log('🔍 Checking if database needs seeding...');
        
        // Wait a bit for connection to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if admin data exists
        const Admin = require('./models/Admin');
        const adminCount = await Admin.countDocuments();
        
        console.log(`📊 Found ${adminCount} admins in database`);
        
        if (adminCount === 0) {
            console.log('📦 Database is empty. Starting auto-seed...');
            const seedAdmin = require('./seedAdminSystem');
            await seedAdmin();
            console.log('✅ Admin system seeded successfully!');
        } else {
            console.log('✅ Admin data exists. Skipping admin seed.');
        }
        
        // Check if student/room data exists
        const Student = require('./models/Student');
        const Room = require('./models/Room');
        const studentCount = await Student.countDocuments();
        const roomCount = await Room.countDocuments();
        
        console.log(`📊 Found ${studentCount} students and ${roomCount} rooms in database`);
        
        if (studentCount === 0 && roomCount === 0) {
            console.log('📦 No students/rooms found. Seeding sample data...');
            const seedData = require('./seeder');
            await seedData(false); // false = don't exit process
            console.log('✅ Sample students and rooms seeded successfully!');
        } else {
            console.log('✅ Student/room data exists. Skipping data seed.');
        }
        
        console.log('🎉 Database initialization complete!');
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        console.error('Stack trace:', error.stack);
        
        // In production, we want to exit if database connection fails
        if (process.env.NODE_ENV === 'production') {
            console.error('💥 Fatal error in production - exiting process');
            process.exit(1);
        }
    }
};

// Initialize database
initializeDatabase();

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running... v1.0');
});

// Manual seed endpoint (for production setup)
app.get('/seed-database', async (req, res) => {
    try {
        const Admin = require('./models/Admin');
        const adminCount = await Admin.countDocuments();
        
        if (adminCount > 0) {
            return res.json({ 
                success: false, 
                message: `Database already has ${adminCount} admins. Seeding skipped.` 
            });
        }
        
        const seedAdmin = require('./seedAdminSystem');
        await seedAdmin();
        
        res.json({ 
            success: true, 
            message: 'Database seeded successfully! Login with username: admin, password: password123' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Seeding failed: ' + error.message 
        });
    }
});

// Check admins endpoint (for debugging)
app.get('/check-admins', async (req, res) => {
    try {
        const Admin = require('./models/Admin');
        const admins = await Admin.find({}).select('email fullName status');
        res.json({ 
            success: true, 
            count: admins.length,
            admins: admins 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Check students endpoint (for debugging)
app.get('/check-students', async (req, res) => {
    try {
        const Student = require('./models/Student');
        const Room = require('./models/Room');
        const students = await Student.find({});
        const rooms = await Room.find({});
        res.json({ 
            success: true, 
            studentCount: students.length,
            roomCount: rooms.length,
            students: students.slice(0, 5), // First 5 students
            rooms: rooms.slice(0, 5) // First 5 rooms
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/multi-auth', require('./routes/multiAuthRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/dorms', require('./routes/dormRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/backup', require('./routes/backupRoutes'));
app.use('/api/cache', require('./routes/cacheRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/proctor', require('./routes/proctorRoutes'));
app.use('/api/maintainer', require('./routes/maintainerRoutes'));
app.use('/api/user-management', require('./routes/userManagementRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));

const PORT = process.env.PORT || 5000;

// ⚡ PERFORMANCE: Initialize Redis cache before starting server
const startServer = async () => {
    try {
        // Initialize Redis (optional - will fallback to memory cache if not available)
        await initRedis();
        
        const server = app.listen(PORT, () => {
            console.log('🚀 ========================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 API URL: http://localhost:${PORT}`);
            console.log('⚡ Performance optimizations: ENABLED');
            console.log('⚡ Compression: ENABLED');
            console.log('⚡ Caching: ' + (process.env.REDIS_URL || process.env.REDIS_HOST ? 'REDIS' : 'IN-MEMORY'));
            console.log('🚀 ========================================');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('💥 UNHANDLED REJECTION! Shutting down...');
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
    });
});
