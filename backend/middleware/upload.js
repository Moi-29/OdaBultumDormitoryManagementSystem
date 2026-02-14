const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Gallery images storage
const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'obu-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

// News/Announcement images storage
const newsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'obu-news',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }]
  }
});

const uploadGallery = multer({ 
  storage: galleryStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadNews = multer({ 
  storage: newsStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = { uploadGallery, uploadNews };
