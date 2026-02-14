/**
 * ⚡ IMAGE OPTIMIZATION UTILITY
 * Converts images to WebP format with multiple sizes for performance
 * Target: Sub-second image loading with progressive enhancement
 */

const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

/**
 * Generate optimized image versions
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} - URLs for different image sizes
 */
const generateOptimizedImages = async (imageBuffer, filename) => {
    try {
        const baseName = filename.split('.')[0];
        const timestamp = Date.now();

        // Generate multiple optimized versions
        const versions = {
            // Low Quality Image Placeholder (LQIP) - for instant loading
            lqip: await sharp(imageBuffer)
                .resize(20, 20, { fit: 'cover' })
                .webp({ quality: 20 })
                .toBuffer(),
            
            // Thumbnail - 300px width
            thumbnail: await sharp(imageBuffer)
                .resize(300, null, { withoutEnlargement: true })
                .webp({ quality: 70 })
                .toBuffer(),
            
            // Medium - 800px width (for gallery grid)
            medium: await sharp(imageBuffer)
                .resize(800, null, { withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer(),
            
            // Large - 1200px width (for full view)
            large: await sharp(imageBuffer)
                .resize(1200, null, { withoutEnlargement: true })
                .webp({ quality: 85 })
                .toBuffer()
        };

        // Upload all versions to Cloudinary
        const uploadPromises = Object.entries(versions).map(([size, buffer]) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `obudms/${size}`,
                        public_id: `${baseName}_${size}_${timestamp}`,
                        resource_type: 'image',
                        format: 'webp'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve({ size, url: result.secure_url, publicId: result.public_id });
                    }
                );
                uploadStream.end(buffer);
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Organize results
        const result = {};
        uploadedImages.forEach(({ size, url, publicId }) => {
            result[size] = { url, publicId };
        });

        return result;
    } catch (error) {
        console.error('Image optimization error:', error);
        throw error;
    }
};

/**
 * Optimize single image for announcements
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} - Optimized image data
 */
const optimizeAnnouncementImage = async (imageBuffer, filename) => {
    try {
        const baseName = filename.split('.')[0];
        const timestamp = Date.now();

        // Generate optimized version for announcements
        const optimizedBuffer = await sharp(imageBuffer)
            .resize(1200, 800, { 
                fit: 'inside',
                withoutEnlargement: true 
            })
            .webp({ quality: 85 })
            .toBuffer();

        // Upload to Cloudinary
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'obudms/announcements',
                    public_id: `announcement_${baseName}_${timestamp}`,
                    resource_type: 'image',
                    format: 'webp'
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            width: result.width,
                            height: result.height,
                            format: result.format,
                            bytes: result.bytes
                        });
                    }
                }
            );
            uploadStream.end(optimizedBuffer);
        });
    } catch (error) {
        console.error('Announcement image optimization error:', error);
        throw error;
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Deleted image: ${publicId}`);
    } catch (error) {
        console.error('Image deletion error:', error);
        throw error;
    }
};

/**
 * Delete multiple image versions
 * @param {Object} imageVersions - Object containing publicIds for different sizes
 */
const deleteImageVersions = async (imageVersions) => {
    try {
        const deletePromises = Object.values(imageVersions)
            .filter(version => version && version.publicId)
            .map(version => cloudinary.uploader.destroy(version.publicId));
        
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} image versions`);
    } catch (error) {
        console.error('Image versions deletion error:', error);
        throw error;
    }
};

/**
 * Get image metadata
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Object>} - Image metadata
 */
const getImageMetadata = async (imageBuffer) => {
    try {
        const metadata = await sharp(imageBuffer).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: metadata.size,
            hasAlpha: metadata.hasAlpha,
            orientation: metadata.orientation
        };
    } catch (error) {
        console.error('Get metadata error:', error);
        throw error;
    }
};

module.exports = {
    generateOptimizedImages,
    optimizeAnnouncementImage,
    deleteImage,
    deleteImageVersions,
    getImageMetadata
};
