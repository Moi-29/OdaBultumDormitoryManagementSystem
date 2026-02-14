const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dilqywrsz',
  api_key: process.env.CLOUDINARY_API_KEY || '585728324617654',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
