const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
// CORS Configuration - supports both development and production
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.ALLOWED_ORIGIN || 'https://your-frontend-url.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection and Auto-seed
const initializeDatabase = async () => {
    try {
        await connectDB();
        console.log('🔍 Checking if database needs seeding...');
        
        // Wait a bit for connection to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Auto-seed database if empty (for production deployment)
        const Admin = require('./models/Admin');
        const adminCount = await Admin.countDocuments();
        
        console.log(`📊 Found ${adminCount} admins in database`);
        
        if (adminCount === 0) {
            console.log('📦 Database is empty. Starting auto-seed...');
            const seedAdmin = require('./seedAdminSystem');
            await seedAdmin();
            console.log('✅ Database seeded successfully!');
        } else {
            console.log('✅ Database already has data. Skipping seed.');
        }
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

// Initialize database
initializeDatabase();

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/dorms', require('./routes/dormRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/backup', require('./routes/backupRoutes'));
app.use('/api/cache', require('./routes/cacheRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
