const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private (Admin)
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ submittedOn: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error while fetching applications' });
    }
};

// @desc    Create new application
// @route   POST /api/applications
// @access  Public (Students)
const createApplication = async (req, res) => {
    try {
        const applicationData = req.body;
        
        const application = await Application.create(applicationData);
        
        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        console.error('Error creating application:', error);
        res.status(500).json({ message: 'Server error while creating application' });
    }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private (Admin or Student if canEdit is true)
const updateApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        // Log activity if admin is making changes
        if (req.admin) {
            try {
                await ActivityLog.create({
                    adminId: req.admin._id,
                    adminName: req.admin.username,
                    action: 'UPDATE',
                    targetType: 'Application',
                    targetId: application._id,
                    details: `Updated application for ${application.studentName}`,
                    ipAddress: req.ip
                });
            } catch (logError) {
                console.error('Error logging activity:', logError);
            }
        }
        
        res.json({
            message: 'Application updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ message: 'Server error while updating application' });
    }
};

// @desc    Toggle edit permission for application
// @route   PATCH /api/applications/:id/edit-permission
// @access  Private (Admin)
const toggleEditPermission = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        application.canEdit = !application.canEdit;
        await application.save();
        
        // Log activity
        if (req.admin) {
            try {
                await ActivityLog.create({
                    adminId: req.admin._id,
                    adminName: req.admin.username,
                    action: 'UPDATE',
                    targetType: 'Application',
                    targetId: application._id,
                    details: `${application.canEdit ? 'Enabled' : 'Disabled'} edit permission for ${application.studentName}`,
                    ipAddress: req.ip
                });
            } catch (logError) {
                console.error('Error logging activity:', logError);
            }
        }
        
        res.json({
            message: `Edit permission ${application.canEdit ? 'enabled' : 'disabled'}`,
            application
        });
    } catch (error) {
        console.error('Error toggling edit permission:', error);
        res.status(500).json({ message: 'Server error while toggling edit permission' });
    }
};

// @desc    Delete single application
// @route   DELETE /api/applications/:id
// @access  Private (Admin)
const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        await Application.findByIdAndDelete(req.params.id);
        
        // Log activity
        if (req.admin) {
            try {
                await ActivityLog.create({
                    adminId: req.admin._id,
                    adminName: req.admin.username,
                    action: 'DELETE',
                    targetType: 'Application',
                    targetId: application._id,
                    details: `Deleted application for ${application.studentName}`,
                    ipAddress: req.ip
                });
            } catch (logError) {
                console.error('Error logging activity:', logError);
            }
        }
        
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Server error while deleting application' });
    }
};

// @desc    Bulk delete applications
// @route   DELETE /api/applications/bulk
// @access  Private (Admin)
const bulkDeleteApplications = async (req, res) => {
    try {
        const { applicationIds } = req.body;
        
        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ message: 'Please provide application IDs to delete' });
        }
        
        // Get application details before deletion for logging
        const applications = await Application.find({ _id: { $in: applicationIds } });
        
        // Delete applications
        const result = await Application.deleteMany({ _id: { $in: applicationIds } });
        
        // Log activity (only if admin info is available)
        if (req.admin) {
            try {
                await ActivityLog.create({
                    adminId: req.admin._id,
                    adminName: req.admin.username,
                    action: 'DELETE',
                    targetType: 'Application',
                    details: `Bulk deleted ${result.deletedCount} application(s): ${applications.map(a => a.studentName).join(', ')}`,
                    ipAddress: req.ip
                });
            } catch (logError) {
                console.error('Error logging activity:', logError);
                // Continue even if logging fails
            }
        }
        
        res.json({ 
            message: `Successfully deleted ${result.deletedCount} application(s)`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error bulk deleting applications:', error);
        res.status(500).json({ message: 'Server error while deleting applications' });
    }
};

module.exports = {
    getApplications,
    createApplication,
    updateApplication,
    toggleEditPermission,
    deleteApplication,
    bulkDeleteApplications
};
