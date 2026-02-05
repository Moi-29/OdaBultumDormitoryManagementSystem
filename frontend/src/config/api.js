/**
 * API Configuration
 * Handles API URL based on environment
 */

// Get API URL from environment variable or use production URL
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD 
                    ? 'https://odabultumdormitorymanagementsystem.onrender.com' 
                    : 'http://localhost:5000');

// Log the API URL
console.log('🔗 API URL:', API_URL);

export default API_URL;
