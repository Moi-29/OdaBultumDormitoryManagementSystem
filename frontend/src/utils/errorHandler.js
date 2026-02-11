/**
 * Centralized error handling utility
 */

export const getErrorMessage = (error) => {
    // Network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return {
            message: 'Cannot connect to server. Please check if the backend is running.',
            type: 'network'
        };
    }

    // CORS errors
    if (error.message?.includes('CORS')) {
        return {
            message: 'CORS error. Please check server configuration.',
            type: 'cors'
        };
    }

    // HTTP status errors
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
            case 400:
                return {
                    message: data?.message || 'Invalid request. Please check your input.',
                    type: 'validation'
                };
            case 401:
                return {
                    message: data?.message || 'Invalid credentials. Please try again.',
                    type: 'auth'
                };
            case 403:
                return {
                    message: data?.message || 'Access denied. You do not have permission.',
                    type: 'forbidden'
                };
            case 404:
                return {
                    message: data?.message || 'Resource not found.',
                    type: 'notfound'
                };
            case 500:
                return {
                    message: data?.message || 'Server error. Please try again later.',
                    type: 'server'
                };
            case 503:
                return {
                    message: data?.message || 'Service unavailable. System may be under maintenance.',
                    type: 'maintenance'
                };
            default:
                return {
                    message: data?.message || `Error ${status}: ${error.message}`,
                    type: 'unknown'
                };
        }
    }

    // Generic errors
    return {
        message: error.message || 'An unexpected error occurred. Please try again.',
        type: 'unknown'
    };
};

export const logError = (context, error) => {
    console.group(`❌ Error in ${context}`);
    console.error('Error object:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.groupEnd();
};
