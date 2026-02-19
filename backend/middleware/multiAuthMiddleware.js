const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Proctor = require('../models/Proctor');
const Maintainer = require('../models/Maintainer');

// Protect routes - verify JWT and user status
const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user based on role
            let user = null;
            let Model = null;

            switch (decoded.role) {
                case 'admin':
                    Model = Admin;
                    user = await Model.findById(decoded.id).populate('role').select('+password');
                    break;
                case 'proctor':
                    Model = Proctor;
                    user = await Model.findById(decoded.id).select('+password');
                    break;
                case 'maintainer':
                    Model = Maintainer;
                    user = await Model.findById(decoded.id).select('+password');
                    break;
                default:
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid token role'
                    });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            // Check if user is active
            if (user.status !== 'active' && user.status !== 'Active') {
                return res.status(403).json({
                    success: false,
                    message: `Account is ${user.status}. Please contact administrator.`
                });
            }

            // Check if account is locked
            if (user.isAccountLocked && user.isAccountLocked()) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is temporarily locked due to multiple failed login attempts'
                });
            }

            // Check if password was changed after token was issued
            if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: 'Password was recently changed. Please log in again.'
                });
            }

            // Grant access - attach user info to request
            req.user = {
                id: user._id,
                role: decoded.role,
                username: user.username,
                fullName: user.fullName,
                blockId: decoded.blockId // For proctors
            };

            console.log('User authenticated:', {
                id: req.user.id,
                role: req.user.role,
                username: req.user.username
            });

            // For admins, attach permissions
            if (decoded.role === 'admin') {
                req.admin = user;
                req.user.permissions = [
                    ...(user.role?.permissions || []),
                    ...(user.customPermissions || [])
                ];
                console.log('Admin permissions:', req.user.permissions);
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Invalid token.'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log('restrictTo middleware:', {
            requiredRoles: roles,
            userRole: req.user?.role,
            userId: req.user?.id,
            username: req.user?.username
        });
        
        if (!roles.includes(req.user.role)) {
            console.log('Access denied - role mismatch');
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
                debug: {
                    required: roles,
                    current: req.user.role
                }
            });
        }
        
        console.log('Access granted');
        next();
    };
};

// Proctor-specific middleware - ensure block restriction
const proctorBlockRestriction = async (req, res, next) => {
    try {
        if (req.user.role !== 'proctor') {
            return next(); // Skip if not a proctor
        }

        // Ensure proctor can only access their assigned block data
        const proctorBlockId = req.user.blockId;

        if (!proctorBlockId) {
            return res.status(403).json({
                success: false,
                message: 'No block assigned to this proctor'
            });
        }

        // Attach blockId to request for use in controllers
        req.proctorBlockId = proctorBlockId;

        next();
    } catch (error) {
        console.error('Proctor block restriction error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error in block restriction'
        });
    }
};

// Admin permission check
const checkPermission = (...requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const admin = req.admin;

            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authenticated as admin'
                });
            }

            // Get all permissions (role permissions + custom permissions)
            const rolePermissions = admin.role?.permissions || [];
            const customPermissions = admin.customPermissions || [];
            const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];

            // Check if admin has required permission
            const hasPermission = requiredPermissions.some(permission =>
                allPermissions.includes(permission) || allPermissions.includes('*')
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to perform this action',
                    required: requiredPermissions,
                    current: allPermissions
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error checking permissions'
            });
        }
    };
};

module.exports = {
    protect,
    restrictTo,
    proctorBlockRestriction,
    checkPermission
};
