# 🏛️ Oda Bultum University - Dormitory Management System

A comprehensive web-based dormitory management system for Oda Bultum University, featuring student applications, room assignments, permission requests, and administrative controls.

## 🌟 Latest Update - Permission System

**NEW FEATURE**: Complete permission request system for students to request permission to leave campus for religious purposes, with admin approval workflow and PDF generation.

[📖 Read Full Permission Feature Documentation](./PERMISSION_FEATURE.md)

## 🚀 Quick Start

**New to this project? Start here:** [START_HERE.md](./START_HERE.md)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Start backend (port 5000)
cd ../backend
npm start

# 4. Start frontend (port 5173)
cd ../frontend
npm run dev
```

### Access
- **Student Portal**: http://localhost:5173/student/home
- **Admin Dashboard**: http://localhost:5173/login

## 📋 Features

### Student Portal
- 🏠 Home Dashboard
- 🏢 Dormitory View
- 📝 Application Form
- ✅ **Permission Requests** (NEW!)
- ⚠️ Report Issues
- 📢 View Announcements
- 🖼️ Gallery

### Admin Dashboard
- 📊 Statistics Dashboard
- 👥 Student Management
- 🏢 Dormitory Management
- 📋 Application Review
- 💬 Request Management
- ✅ **Permission Management** (NEW!)
- 📢 Announcements & Events
- 🖼️ Gallery Management
- ⚙️ System Settings
- 👨‍💼 Admin Management
- 🔐 User Management

### Permission System (NEW!)
- **Student Features**:
  - Submit permission requests for religious purposes
  - View request history and status
  - Read admin feedback
  - Agreement acknowledgment system

- **Admin Features**:
  - View all permission requests
  - Statistics dashboard
  - Filter by status (Pending/Approved/Rejected)
  - Search by student details
  - Approve/Reject with notes
  - Download individual or bulk PDFs

## 🏗️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB (Atlas)
- JWT Authentication
- Cloudinary (Image Storage)
- PDFKit (PDF Generation)
- Redis (Caching - Optional)

### Frontend
- React 18
- Vite
- React Router
- Axios
- Context API (State Management)
- Lucide Icons

## 📁 Project Structure

```
OdaBultumDormitoryManagementSystem/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── assets/     # Images & static files
│   │   ├── components/ # Reusable components
│   │   ├── config/     # Configuration
│   │   ├── context/    # React Context
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── styles/     # CSS files
│   │   ├── translations/ # i18n
│   │   └── utils/      # Helper functions
│   ├── .env           # Environment variables
│   └── vite.config.js # Vite configuration
│
└── Documentation/
    ├── PERMISSION_FEATURE.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── QUICK_START_GUIDE.md
    ├── VISUAL_SUMMARY.md
    ├── ENVIRONMENT_SETUP.md
    └── START_HERE.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGIN=your_frontend_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

[📖 Detailed Environment Setup Guide](./ENVIRONMENT_SETUP.md)

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Complete setup guide for new developers
- **[PERMISSION_FEATURE.md](./PERMISSION_FEATURE.md)** - Permission system documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Quick reference guide
- **[VISUAL_SUMMARY.md](./VISUAL_SUMMARY.md)** - Visual diagrams and UI mockups
- **[ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)** - Environment configuration

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Input validation
- XSS protection
- MongoDB injection prevention
- Secure file uploads

## 🌍 Multi-language Support

- English
- Amharic (አማርኛ)
- Afaan Oromo
- Somali (Af-Somali)
- Tigrinya (ትግርኛ)
- Arabic (العربية)

## 🎨 UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Modal dialogs
- Professional styling

## 📊 API Endpoints

### Permission System
```
POST   /api/permissions              # Create permission request
GET    /api/permissions              # Get all permissions (Admin)
GET    /api/permissions/student/:id  # Get student's permissions
PATCH  /api/permissions/:id/status   # Update permission status
DELETE /api/permissions/:id          # Delete permission
GET    /api/permissions/:id/pdf      # Download single PDF
GET    /api/permissions/export/all-pdf # Download all PDFs
```

[📖 Full API Documentation](./API_DOCUMENTATION.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Render/Heroku)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository
3. Set `VITE_API_URL` to production backend
4. Deploy

## 📈 Performance Optimizations

- Response compression (GZIP/Brotli)
- Redis caching (optional)
- Image optimization with Sharp
- Lazy loading
- Code splitting
- Minification
- CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

- **Developer**: [Your Name]
- **University**: Oda Bultum University
- **Project**: Dormitory Management System

## 📞 Support

For support and questions:
- Email: support@obu.edu.et
- Documentation: See docs folder
- Issues: GitHub Issues

## 🎯 Roadmap

### Completed ✅
- Student portal
- Admin dashboard
- Application system
- Request management
- Permission system
- PDF generation
- Multi-language support
- Dark mode

### Upcoming 🚧
- Email notifications
- SMS notifications
- Mobile app
- QR code verification
- Analytics dashboard
- Bulk operations
- Advanced reporting
- Integration with campus security

## 🙏 Acknowledgments

- Oda Bultum University
- All contributors
- Open source community

## 📸 Screenshots

### Student Portal - Permission Request
![Student Permission](./screenshots/student-permission.png)

### Admin Dashboard - Permission Management
![Admin Permissions](./screenshots/admin-permissions.png)

### PDF Output
![Permission PDF](./screenshots/permission-pdf.png)

---

**Version**: 2.0.0  
**Last Updated**: February 17, 2026  
**Status**: ✅ Production Ready

**🚀 Ready to get started? Check out [START_HERE.md](./START_HERE.md)**
