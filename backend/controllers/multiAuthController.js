const Admin = require('../models/Admin');
const Proctor = require('../models/Proctor');
const Maintainer = require('../models/Maintainer');
const SystemSettings = require('../models/SystemSettings');
const ActivityLog = require('../models/ActivityLog');
const LoginHistory = require('../models/LoginHistory');
const generateToken = require('../utils/generateToken');

// @desc    Multi-role login (Admin, Proctor, Maintainer)
// @route   POST /api/auth/multi-login
// @access  Public
const multiRoleLogin = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide username and password' 
            });
        }

        let user = null;
        let userRole = role || 'admin'; // Default to admin if not specified
        let Model = null;

        // Determine which model to use based on role
        switch (userRole.toLowerCase()) {
            case 'admin':
                Model = Admin;
                break;
            case 'proctor':
                Model = Proctor;
                break;
            case 'maintainer':
                Model = Maintainer;
                break;
            default:
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid role specified' 
                });
        }

        // Find user by username
        user = await Model.findOne({ 
            $or: [
                { username: username.toLowerCase() },
                { email: username.toLowerCase() }
            ]
        }).select('+password');

        if (!user) {
            console.log(`Login attempt failed: User not found for ${userRole} with username: ${username}`);
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        console.log(`User found: ${user.username}, status: ${user.status}, role: ${userRole}`);

        // Check if account is locked
        if (user.isAccountLocked && user.isAccountLocked()) {
            return res.status(403).json({ 
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
            });
        }

        // Check account status (case-insensitive)
        if (user.status && user.status.toLowerCase() !== 'active') {
            return res.status(403).json({ 
                success: false,
                message: `Account is ${user.status}. Please contact administrator.` 
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            // Increment failed login attempts
            if (user.incrementLoginAttempts) {
                await user.incrementLoginAttempts();
            }

            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check maintenance mode (only for non-admins)
        if (userRole !== 'admin') {
            const settings = await SystemSettings.findOne();
            if (settings && settings.maintenanceMode) {
                return res.status(503).json({ 
                    success: false,
                    message: 'System is currently under maintenance. Please try again later.' 
                });
            }
        }

        // Reset failed login attempts on successful login
        if (user.resetLoginAttempts) {
            await user.resetLoginAttempts();
        }

        // Update last login info
        user.lastLogin = new Date();
        user.lastLoginIP = req.ip || req.connection.remoteAddress;
        await user.save();

        // Log login activity for admins
        if (userRole === 'admin') {
            try {
                await ActivityLog.create({
                    performedBy: user._id,
                    actionType: 'LOGIN_SUCCESS',
                    description: `Admin ${user.fullName} logged in successfully`,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.headers['user-agent']
                });

                await LoginHistory.create({
                    admin: user._id,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    status: 'success'
                });
            } catch (logError) {
                console.error('Error logging activity:', logError);
            }
        }

        // Generate JWT token with role and blockId (for proctors)
        const tokenPayload = {
            id: user._id,
            role: userRole,
            username: user.username
        };

        // Add blockId for proctors
        if (userRole === 'proctor' && user.blockId) {
            tokenPayload.blockId = user.blockId;
        }

        const token = generateToken(tokenPayload);

        // Prepare response data
        const responseData = {
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: userRole, // Keep as string for frontend routing
                status: user.status
            }
        };

        // Add role-specific data
        if (userRole === 'admin') {
            const populatedUser = await Admin.findById(user._id).populate('role');
            responseData.user.roleDetails = populatedUser.role; // Store populated role separately
            responseData.user.department = user.department;
            responseData.user.permissions = [
                ...(populatedUser.role?.permissions || []),
                ...(user.customPermissions || [])
            ];
        } else if (userRole === 'proctor') {
            responseData.user.blockId = user.blockId;
        } else if (userRole === 'maintainer') {
            responseData.user.specialization = user.specialization;
        }

        res.json(responseData);

    } catch (error) {
        console.error('Multi-role login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login',
            error: error.message 
        });
    }
};

// @desc    Get current user profile (multi-role)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const { role, id } = req.user;

        let user = null;
        let Model = null;

        switch (role) {
            case 'admin':
                Model = Admin;
                user = await Model.findById(id).populate('role').select('-password');
                break;
            case 'proctor':
                Model = Proctor;
                user = await Model.findById(id).select('-password');
                break;
            case 'maintainer':
                Model = Maintainer;
                user = await Model.findById(id).select('-password');
                break;
            default:
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid role' 
                });
        }

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const responseData = {
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: role,
                status: user.status
            }
        };

        // Add role-specific data
        if (role === 'admin') {
            responseData.user.department = user.department;
            responseData.user.roleDetails = user.role;
            responseData.user.permissions = [
                ...(user.role?.permissions || []),
                ...(user.customPermissions || [])
            ];
        } else if (role === 'proctor') {
            responseData.user.blockId = user.blockId;
        } else if (role === 'maintainer') {
            responseData.user.specialization = user.specialization;
        }

        res.json(responseData);

    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

// @desc    Change password (multi-role)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const { role, id } = req.user;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide current and new password' 
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: 'New password must be at least 8 characters' 
            });
        }

        let Model = null;
        switch (role) {
            case 'admin':
                Model = Admin;
                break;
            case 'proctor':
                Model = Proctor;
                break;
            case 'maintainer':
                Model = Maintainer;
                break;
            default:
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid role' 
                });
        }

        const user = await Model.findById(id).select('+password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

// @desc    Logout (clear session/token)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    try {
        // In a JWT-based system, logout is typically handled client-side
        // by removing the token. However, we can log the logout activity.

        const { role, id } = req.user;

        if (role === 'admin') {
            try {
                const admin = await Admin.findById(id);
                if (admin) {
                    await ActivityLog.create({
                        performedBy: id,
                        actionType: 'LOGOUT',
                        description: `Admin ${admin.fullName} logged out`,
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.headers['user-agent']
                    });
                }
            } catch (logError) {
                console.error('Error logging logout:', logError);
            }
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

module.exports = {
    multiRoleLogin,
    getMe,
    changePassword,
    logout
};
