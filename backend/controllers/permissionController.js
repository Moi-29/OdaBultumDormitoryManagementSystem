const Permission = require('../models/Permission');
const PDFDocument = require('pdfkit');

// Get all permissions (Admin)
exports.getPermissions = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        
        const permissions = await Permission.find(query)
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(permissions);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get student's own permissions
exports.getStudentPermissions = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const permissions = await Permission.find({ studentId })
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(permissions);
    } catch (error) {
        console.error('Error fetching student permissions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create permission request
exports.createPermission = async (req, res) => {
    try {
        const { studentId, fullName, department, year, sex, date, userId } = req.body;
        
        // Validate required fields
        if (!studentId || !fullName || !department || !year || !sex || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const permission = new Permission({
            studentId,
            fullName,
            department,
            year,
            sex,
            date: new Date(date),
            userId
        });
        
        await permission.save();
        
        res.status(201).json({ 
            message: 'Permission request submitted successfully', 
            permission 
        });
    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update permission status (Admin)
exports.updatePermissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        
        const permission = await Permission.findById(id);
        
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        
        permission.status = status;
        permission.adminNotes = adminNotes;
        
        if (status === 'approved' || status === 'rejected') {
            permission.approvedBy = req.user._id;
            permission.approvedAt = new Date();
        }
        
        await permission.save();
        
        res.json({ message: 'Permission status updated', permission });
    } catch (error) {
        console.error('Error updating permission:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete permission
exports.deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        
        const permission = await Permission.findByIdAndDelete(id);
        
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Generate PDF for single permission
exports.generatePermissionPDF = async (req, res) => {
    try {
        const { id } = req.params;
        
        const permission = await Permission.findById(id);
        
        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        
        const doc = new PDFDocument({ 
            margin: 40,
            size: 'A4',
            bufferPages: true
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=permission-${permission.studentId}.pdf`);
        
        doc.pipe(res);
        
        const path = require('path');
        const fs = require('fs');
        
        // Colors
        const primaryColor = '#2d9f6e';
        const textColor = '#2c3e50';
        const lightGray = '#f5f5f5';
        
        // Logo
        const logoPath = path.join(__dirname, '../assets/obu-logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 30, 30, { width: 60 });
        }
        
        // University Name
        doc.moveDown(4);
        doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor);
        doc.text('ODA BULTUM UNIVERSITY', { align: 'center' });
        doc.fontSize(11).font('Helvetica').fillColor(textColor);
        doc.text('Student Service Directorate', { align: 'center' });
        doc.moveDown(0.5);
        
        // Horizontal line
        doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke(primaryColor);
        doc.moveDown(0.8);
        
        // Document Title
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor);
        doc.text('PERMISSION LETTER', { align: 'center' });
        doc.moveDown(0.8);
        
        // Student Information
        doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor);
        doc.text('Student Information', 40);
        doc.moveDown(0.3);
        
        const infoY = doc.y;
        doc.fontSize(9).font('Helvetica');
        
        // Left column
        doc.text('Full Name:', 40, infoY);
        doc.text(permission.fullName, 110, infoY);
        
        doc.text('Student ID:', 40, infoY + 15);
        doc.text(permission.studentId, 110, infoY + 15);
        
        doc.text('Department:', 40, infoY + 30);
        doc.text(permission.department, 110, infoY + 30);
        
        // Right column
        doc.text('Year:', 320, infoY);
        doc.text(permission.year, 360, infoY);
        
        doc.text('Sex:', 320, infoY + 15);
        doc.text(permission.sex, 360, infoY + 15);
        
        doc.text('Date:', 320, infoY + 30);
        doc.text(new Date(permission.date).toLocaleDateString(), 360, infoY + 30);
        
        doc.y = infoY + 50;
        doc.moveDown(0.5);
        
        // Permission Agreement
        doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor);
        doc.text('Permission Agreement', 40);
        doc.moveDown(0.3);
        
        doc.fontSize(9).font('Helvetica').fillColor(textColor);
        const agreementIntro = `I, ${permission.fullName}, hereby request permission to leave the campus for religious purposes. I understand and agree to the following terms:`;
        doc.text(agreementIntro, 40, doc.y, { width: doc.page.width - 80, align: 'justify' });
        doc.moveDown(0.3);
        
        // Terms - compact format
        const terms = [
            'I will leave the campus for religious purposes only.',
            'I will return to the dormitory no later than 9:00 PM on the same day.',
            'I take full responsibility for my safety and well-being while off campus.',
            'I understand that any incidents that occur while off campus are my sole responsibility.',
            'I will comply with all university rules and regulations during my absence.',
            'I will inform the administration immediately if unable to return by the specified time.'
        ];
        
        terms.forEach((term, index) => {
            doc.fontSize(8).font('Helvetica').fillColor(textColor);
            doc.text(`${index + 1}. ${term}`, 50, doc.y, { width: doc.page.width - 90, align: 'justify' });
            doc.moveDown(0.2);
        });
        
        doc.moveDown(0.3);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor);
        doc.text('I acknowledge that I have read, understood, and agree to abide by all terms stated above.', 40, doc.y, { width: doc.page.width - 80, align: 'justify' });
        doc.moveDown(0.8);
        
        // Status
        const statusColor = permission.status === 'approved' ? '#27ae60' : permission.status === 'rejected' ? '#e74c3c' : '#f39c12';
        doc.fontSize(10).font('Helvetica-Bold').fillColor(statusColor);
        doc.text(`Status: ${permission.status.toUpperCase()}`, 40);
        
        if (permission.adminNotes) {
            doc.moveDown(0.3);
            doc.fontSize(9).font('Helvetica').fillColor(textColor);
            doc.text(`Admin Notes: ${permission.adminNotes}`, 40, doc.y, { width: doc.page.width - 80 });
        }
        
        doc.moveDown(0.8);
        
        // Signature Section
        const sigY = doc.y;
        doc.fontSize(9).font('Helvetica-Bold').fillColor(textColor);
        
        // Signature line
        doc.text('Signature:', 40, sigY);
        doc.moveTo(95, sigY + 12).lineTo(250, sigY + 12).stroke(textColor);
        
        // Date line
        doc.text('Date:', 320, sigY);
        doc.moveTo(355, sigY + 12).lineTo(510, sigY + 12).stroke(textColor);
        
        // Footer - Fixed position at bottom of page
        const footerY = doc.page.height - 50;
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#7f8c8d');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, footerY, { align: 'center', width: doc.page.width - 80 });
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#7f8c8d');
        doc.text('Oda Bultum University - Student Service Directorate', 40, footerY + 12, { align: 'center', width: doc.page.width - 80 });
        
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Generate PDF for all permissions
exports.generateAllPermissionsPDF = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        let query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        
        const permissions = await Permission.find(query).sort({ createdAt: -1 });
        
        if (permissions.length === 0) {
            return res.status(404).json({ message: 'No permissions found' });
        }
        
        const doc = new PDFDocument({ 
            margin: 40,
            size: 'A4',
            bufferPages: true
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=all-permissions.pdf');
        
        doc.pipe(res);
        
        const path = require('path');
        const fs = require('fs');
        
        // Colors
        const primaryColor = '#2d9f6e';
        const textColor = '#2c3e50';
        
        // Logo
        const logoPath = path.join(__dirname, '../assets/obu-logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 30, 30, { width: 60 });
        }
        
        // University Name
        doc.moveDown(4);
        doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor);
        doc.text('ODA BULTUM UNIVERSITY', { align: 'center' });
        doc.fontSize(11).font('Helvetica').fillColor(textColor);
        doc.text('Student Service Directorate', { align: 'center' });
        doc.moveDown(0.5);
        
        // Horizontal line
        doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke(primaryColor);
        doc.moveDown(0.8);
        
        // Document Title
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor);
        doc.text('PERMISSION REQUESTS REPORT', { align: 'center' });
        doc.moveDown(0.5);
        
        // Summary
        doc.fontSize(9).font('Helvetica').fillColor(textColor);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(0.5);
        
        doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor);
        doc.text(`Total Permissions: ${permissions.length}`, 40);
        doc.moveDown(1);
        
        // Permissions List
        permissions.forEach((permission, index) => {
            if (index > 0) {
                doc.moveDown(0.3);
                doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke('#bdc3c7');
                doc.moveDown(0.3);
            }
            
            // Check if we need a new page
            if (doc.y > 700) {
                doc.addPage();
            }
            
            // Permission entry
            const entryY = doc.y;
            
            // Number
            doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor);
            doc.text(`${index + 1}.`, 40, entryY);
            
            // Student info
            doc.fontSize(10).font('Helvetica-Bold').fillColor(textColor);
            doc.text(`${permission.fullName} (${permission.studentId})`, 55, entryY);
            
            doc.fontSize(8).font('Helvetica').fillColor('#7f8c8d');
            doc.text(`${permission.department} | ${permission.year} | ${permission.sex}`, 55, entryY + 12);
            doc.text(`Date: ${new Date(permission.date).toLocaleDateString()} | Submitted: ${new Date(permission.createdAt).toLocaleDateString()}`, 55, entryY + 22);
            
            // Status
            const statusColor = permission.status === 'approved' ? '#27ae60' : permission.status === 'rejected' ? '#e74c3c' : '#f39c12';
            doc.fontSize(8).font('Helvetica-Bold').fillColor(statusColor);
            doc.text(`Status: ${permission.status.toUpperCase()}`, doc.page.width - 150, entryY + 5);
            
            if (permission.adminNotes) {
                doc.fontSize(8).font('Helvetica').fillColor(textColor);
                doc.text(`Notes: ${permission.adminNotes}`, 55, entryY + 35, { width: doc.page.width - 100 });
                doc.y = entryY + 50;
            } else {
                doc.y = entryY + 35;
            }
        });
        
        // Footer on last page - Fixed position
        const footerY = doc.page.height - 50;
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#7f8c8d');
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, footerY, { align: 'center', width: doc.page.width - 80 });
        doc.fontSize(8).font('Helvetica-Oblique').fillColor('#7f8c8d');
        doc.text('Oda Bultum University - Student Service Directorate', 40, footerY + 12, { align: 'center', width: doc.page.width - 80 });
        
        doc.end();
    } catch (error) {
        console.error('Error generating all permissions PDF:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
