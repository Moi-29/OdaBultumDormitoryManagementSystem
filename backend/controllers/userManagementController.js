const Proctor = require('../models/Proctor');
const Maintainer = require('../models/Maintainer');
const Request = require('../models/Request');

// ============= PROCTOR MANAGEMENT =============

// @desc    Create new proctor
// @route   POST /api/user-management/proctors
// @access  Private (Admin)
const createProctor = async (req, res) => {
    try {
        const { fullName, username, password, phone, email, blockId } = req.body;

        console.log('Creating proctor with data:', { fullName, username, blockId, phone, email });

        // Validation
        if (!fullName || !username || !password || !blockId) {
            return res.status(400).json({ 
                success: false,
                message: 'Full name, username, password, and block assignment are required' 
            });
        }

        // Check if username already exists
        const existingProctor = await Proctor.findOne({ username: username.toLowerCase() });
        if (existingProctor) {
            return res.status(400).json({ 
                success: false,
                message: 'Username already exists' 
            });
        }

        // Verify block exists in Room collection (real data)
        const Room = require('../models/Room');
        const blockExists = await Room.findOne({ building: blockId });
        if (!blockExists) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid block ID. Block must exist in Dormitories section first.' 
            });
        }

        // Create proctor
        const proctorData = {
            fullName,
            username: username.toLowerCase(),
            password,
            phone: phone || '',
            email: email || '',
            blockId,
            status: 'active'
        };

        // Add createdBy only if admin exists
        if (req.admin && req.admin._id) {
            proctorData.createdBy = req.admin._id;
        }

        const proctor = await Proctor.create(proctorData);

        console.log('Proctor created successfully:', proctor._id);

        res.status(201).json({
            success: true,
            message: 'Proctor created successfully',
            proctor: {
                id: proctor._id,
                fullName: proctor.fullName,
                username: proctor.username,
                blockId: proctor.blockId,
                status: proctor.status
            }
        });
    } catch (error) {
        console.error('Error creating proctor:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Get all proctors
// @route   GET /api/user-management/proctors
// @access  Private (Admin)
const getProctors = async (req, res) => {
    try {
        console.log('getProctors called');
        const { status, blockId } = req.query;

        let query = {};
        if (status) query.status = status;
        if (blockId) query.blockId = blockId;

        const proctors = await Proctor.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        console.log('Proctors found:', proctors.length);

        res.json({
            success: true,
            count: proctors.length,
            proctors
        });
    } catch (error) {
        console.error('Error fetching proctors:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Get single proctor
// @route   GET /api/user-management/proctors/:id
// @access  Private (Admin)
const getProctor = async (req, res) => {
    try {
        const proctor = await Proctor.findById(req.params.id).select('-password');
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Get proctor's statistics
        const totalReports = await Request.countDocuments({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor'
        });

        const pendingReports = await Request.countDocuments({
            fromUserId: proctor._id,
            fromUserModel: 'Proctor',
            status: 'pending'
        });

        res.json({
            success: true,
            proctor,
            stats: {
                totalReports,
                pendingReports
            }
        });
    } catch (error) {
        console.error('Error fetching proctor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update proctor
// @route   PUT /api/user-management/proctors/:id
// @access  Private (Admin)
const updateProctor = async (req, res) => {
    try {
        const { fullName, username, password, phone, email, blockId, status } = req.body;

        const proctor = await Proctor.findById(req.params.id);
        
        if (!proctor) {
            return res.status(404).json({ message: 'Proctor not found' });
        }

        // Update fields
        if (fullName) proctor.fullName = fullName;
        if (username) proctor.username = username.toLowerCase();
        if (password) proctor.password = password; // Will be hashed by pre-save hook
        if (phone) proctor.phone = phone;
        if (email) proctor.email = email;
        if (status) proctor.status = status;
        
        // Handle block reassignment
        if (blockId && blockId !== proctor.blockId) {
            // Verify new block exists in Room collection (real data)
            const Room = require('../models/Room');
            const blockExists = await Room.findOne({ building: blockId });
            if (!blockExists) {
                return res.status(400).json({ 
                    message: 'Invalid block ID. Block must exist in Dormitories section first.' 
                });
            }

            proctor.blockId = blockId;
        }

        await proctor.save();

        res.json({
            success: true,
            message: 'Proctor updated successfully',
            proctor: {
                id: proctor._id,
                fullName: proctor.fullName,
                username: proctor.username,
                blockId: proctor.blockId,
                status: proctor.status
            }
        });
    } catch (error) {
        console.error('Error updating proctor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete/Dismiss proctor
// @route   DELETE /api/user-management/proctors/:id
// @access  Private (Admin)
const deleteProctor = async (req, res) => {
    try {
        console.log('deleteProctor called:', { id: req.params.id, permanent: req.query.permanent });
        
        const proctor = await Proctor.findById(req.params.id);
        
        if (!proctor) {
            console.log('Proctor not found:', req.params.id);
            return res.status(404).json({ 
                success: false,
                message: 'Proctor not found' 
            });
        }

        // Check if permanent delete is requested
        const { permanent } = req.query;
        
        if (permanent === 'true') {
            console.log('Permanently deleting proctor:', proctor._id);
            // Hard delete - permanently remove from database
            await proctor.deleteOne();
            console.log('Proctor permanently deleted');
            
            res.json({
                success: true,
                message: 'Proctor permanently deleted from database'
            });
        } else {
            console.log('Soft deleting proctor (dismissing):', proctor._id);
            // Soft delete - set status to dismissed
            proctor.status = 'dismissed';
            await proctor.save();
            console.log('Proctor dismissed');

            res.json({
                success: true,
                message: 'Proctor dismissed successfully'
            });
        }
    } catch (error) {
        console.error('Error deleting proctor:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ============= MAINTAINER MANAGEMENT =============

// @desc    Create new maintainer
// @route   POST /api/user-management/maintainers
// @access  Private (Admin)
const createMaintainer = async (req, res) => {
    try {
        const { fullName, username, password, phone, email, specialization } = req.body;

        console.log('Creating maintainer with data:', { fullName, username, specialization, phone, email });

        // Validation
        if (!fullName || !username || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Full name, username, and password are required' 
            });
        }

        // Check if username already exists
        const existingMaintainer = await Maintainer.findOne({ username: username.toLowerCase() });
        if (existingMaintainer) {
            return res.status(400).json({ 
                success: false,
                message: 'Username already exists' 
            });
        }

        // Create maintainer
        const maintainerData = {
            fullName,
            username: username.toLowerCase(),
            password,
            phone: phone || '',
            email: email || '',
            specialization: specialization || 'general',
            status: 'active'
        };

        // Add createdBy only if admin exists
        if (req.admin && req.admin._id) {
            maintainerData.createdBy = req.admin._id;
        }

        const maintainer = await Maintainer.create(maintainerData);

        console.log('Maintainer created successfully:', maintainer._id);

        res.status(201).json({
            success: true,
            message: 'Maintainer created successfully',
            maintainer: {
                id: maintainer._id,
                fullName: maintainer.fullName,
                username: maintainer.username,
                specialization: maintainer.specialization,
                status: maintainer.status
            }
        });
    } catch (error) {
        console.error('Error creating maintainer:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Get all maintainers
// @route   GET /api/user-management/maintainers
// @access  Private (Admin)
const getMaintainers = async (req, res) => {
    try {
        console.log('getMaintainers called');
        const { status, specialization } = req.query;

        let query = {};
        if (status) query.status = status;
        if (specialization) query.specialization = specialization;

        const maintainers = await Maintainer.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        console.log('Maintainers found:', maintainers.length);

        res.json({
            success: true,
            count: maintainers.length,
            maintainers
        });
    } catch (error) {
        console.error('Error fetching maintainers:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Get single maintainer
// @route   GET /api/user-management/maintainers/:id
// @access  Private (Admin)
const getMaintainer = async (req, res) => {
    try {
        const maintainer = await Maintainer.findById(req.params.id).select('-password');
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Get maintainer's statistics
        const totalRequests = await Request.countDocuments({
            fromUserId: maintainer._id,
            fromUserModel: 'Maintainer'
        });

        const completedWorkOrders = await Request.countDocuments({
            toUserId: maintainer._id,
            toUserModel: 'Maintainer',
            status: 'resolved'
        });

        res.json({
            success: true,
            maintainer,
            stats: {
                totalRequests,
                completedWorkOrders
            }
        });
    } catch (error) {
        console.error('Error fetching maintainer:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update maintainer
// @route   PUT /api/user-management/maintainers/:id
// @access  Private (Admin)
const updateMaintainer = async (req, res) => {
    try {
        const { fullName, username, password, phone, email, specialization, status } = req.body;

        const maintainer = await Maintainer.findById(req.params.id);
        
        if (!maintainer) {
            return res.status(404).json({ message: 'Maintainer not found' });
        }

        // Update fields
        if (fullName) maintainer.fullName = fullName;
        if (username) maintainer.username = username.toLowerCase();
        if (password) maintainer.password = password; // Will be hashed by pre-save hook
        if (phone) maintainer.phone = phone;
        if (email) maintainer.email = email;
        if (specialization) maintainer.specialization = specialization;
        if (status) maintainer.status = status;

        await maintainer.save();

        res.json({
            success: true,
            message: 'Maintainer updated successfully',
            maintainer: {
                id: maintainer._id,
                fullName: maintainer.fullName,
                username: maintainer.username,
                specialization: maintainer.specialization,
                status: maintainer.status
            }
        });
    } catch (error) {
        console.error('Error updating maintainer:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete/Dismiss maintainer
// @route   DELETE /api/user-management/maintainers/:id
// @access  Private (Admin)
const deleteMaintainer = async (req, res) => {
    try {
        console.log('deleteMaintainer called:', { id: req.params.id, permanent: req.query.permanent });
        
        const maintainer = await Maintainer.findById(req.params.id);
        
        if (!maintainer) {
            console.log('Maintainer not found:', req.params.id);
            return res.status(404).json({ 
                success: false,
                message: 'Maintainer not found' 
            });
        }

        // Check if permanent delete is requested
        const { permanent } = req.query;
        
        if (permanent === 'true') {
            console.log('Permanently deleting maintainer:', maintainer._id);
            // Hard delete - permanently remove from database
            await maintainer.deleteOne();
            console.log('Maintainer permanently deleted');
            
            res.json({
                success: true,
                message: 'Maintainer permanently deleted from database'
            });
        } else {
            console.log('Soft deleting maintainer (dismissing):', maintainer._id);
            // Soft delete - set status to dismissed
            maintainer.status = 'dismissed';
            await maintainer.save();
            console.log('Maintainer dismissed');

            res.json({
                success: true,
                message: 'Maintainer dismissed successfully'
            });
        }
    } catch (error) {
        console.error('Error deleting maintainer:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ============= BLOCK MANAGEMENT =============

// @desc    Get all blocks (from Room collection - real data)
// @route   GET /api/user-management/blocks
// @access  Private (Admin)
const getBlocks = async (req, res) => {
    try {
        console.log('getBlocks called');
        const Room = require('../models/Room');
        
        // Get unique buildings (blocks) from Room collection
        const rooms = await Room.find().select('building gender');
        console.log('Rooms found:', rooms.length);
        
        // Group by building to get unique blocks with their gender
        const blockMap = new Map();
        rooms.forEach(room => {
            if (!blockMap.has(room.building)) {
                blockMap.set(room.building, {
                    name: room.building,
                    gender: room.gender,
                    description: `${room.gender === 'M' ? 'Male' : 'Female'} Dormitory Block`
                });
            }
        });
        
        // Convert to array and sort
        const blocks = Array.from(blockMap.values()).sort((a, b) => 
            a.name.localeCompare(b.name)
        );

        console.log('Blocks found:', blocks.length);

        res.json({
            success: true,
            count: blocks.length,
            blocks
        });
    } catch (error) {
        console.error('Error fetching blocks:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

// @desc    Create new block
// @route   POST /api/user-management/blocks
// @access  Private (Admin)
const createBlock = async (req, res) => {
    try {
        // Blocks are automatically created when rooms are added in the Dormitories section
        // This endpoint is kept for API compatibility but returns a message
        res.status(400).json({ 
            success: false,
            message: 'Blocks are managed through the Dormitories section. Please add rooms there to create blocks.' 
        });
    } catch (error) {
        console.error('Error creating block:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    // Proctor management
    createProctor,
    getProctors,
    getProctor,
    updateProctor,
    deleteProctor,
    
    // Maintainer management
    createMaintainer,
    getMaintainers,
    getMaintainer,
    updateMaintainer,
    deleteMaintainer,
    
    // Block management
    getBlocks,
    createBlock
};
