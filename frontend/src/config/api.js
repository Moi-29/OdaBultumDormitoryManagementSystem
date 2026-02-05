/**
 * API Configuration
 * Handles API URL based on environment
 */

// Get API URL from environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log the API URL in development mode
if (import.meta.env.DEV) {
    console.log('🔗 API URL:', API_URL);
}

export default API_URL;
