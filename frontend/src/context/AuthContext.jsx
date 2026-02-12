import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { getErrorMessage, logError } from '../utils/errorHandler';

// Authentication Context for managing user state and authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Multi-role login - tries all roles automatically
    const login = async (username, password, role = null) => {
        // If no role specified, try to login and let backend determine role
        if (!role) {
            // Try each role until one succeeds
            const roles = ['admin', 'proctor', 'maintainer'];
            let lastError = null;
            
            for (const tryRole of roles) {
                try {
                    const response = await axios.post(`${API_URL}/api/multi-auth/login`, {
                        username,
                        password,
                        role: tryRole
                    });

                    const { token, user: userData } = response.data;

                    // Store token and user data
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Set default authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    setUser(userData);

                    return { success: true, user: userData };
                } catch (error) {
                    // Store the error and continue to next role
                    lastError = error;
                    continue;
                }
            }
            
            // If all roles failed, return error
            logError('AuthContext.login', lastError);
            const { message } = getErrorMessage(lastError);
            return {
                success: false,
                message: message || 'Invalid credentials. Please check your username and password.'
            };
        }
        
        // If role is specified, use it directly
        try {
            const response = await axios.post(`${API_URL}/api/multi-auth/login`, {
                username,
                password,
                role
            });

            const { token, user: userData } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            logError('AuthContext.login', error);
            const { message } = getErrorMessage(error);
            return {
                success: false,
                message: message
            };
        }
    };

    // Legacy admin login (for backward compatibility)
    const adminLogin = async (username, password) => {
        return login(username, password, 'admin');
    };

    const logout = async () => {
        try {
            // Call logout endpoint
            await axios.post(`${API_URL}/api/multi-auth/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userInfo'); // Legacy cleanup
            localStorage.removeItem('adminInfo'); // Legacy cleanup
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        login,
        adminLogin, // Keep for backward compatibility
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isProctor: user?.role === 'proctor',
        isMaintainer: user?.role === 'maintainer'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
