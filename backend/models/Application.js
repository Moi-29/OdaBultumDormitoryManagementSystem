const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    studentName: {
        type: String,
        required: true
    },
    submittedOn: {
        type: Date,
        default: Date.now
    },
    canEdit: {
        type: Boolean,
        default: false
    },
    personalInfo: {
        fullName: String,
        idNo: String,
        sex: String,
        mealCardNo: String,
        college: String,
        department: String,
        academicYear: String,
        dormNo: String,
        phone: String,
        religious: String,
        nation: String
    },
    educationalInfo: {
        stream: String,
        sponsorCategory: String,
        nationalExamYear: String,
        entryYear: String,
        sponsoredBy: String,
        examinationId: String,
        admissionDate: String,
        checkedInDate: String,
        nationalExamResult: String
    },
    schoolInfo: {
        schoolName: String,
        region: String,
        city: String,
        zone: String,
        schoolType: String,
        woreda: String,
        attendedYearFrom: String,
        attendedYearTo: String
    },
    familyInfo: {
        nationality: String,
        region: String,
        zone: String,
        woreda: String,
        kebele: String,
        motherName: String,
        familyPhone: String
    },
    emergencyInfo: {
        fullName: String,
        relationship: String,
        job: String,
        homeTown: String
    }
}, {
    timestamps: true
});

// ⚡ PERFORMANCE INDEXES - Optimized for application queries
applicationSchema.index({ studentId: 1 }, { unique: true }); // Primary key
applicationSchema.index({ submittedOn: -1 }); // Submission date sorting
applicationSchema.index({ canEdit: 1, submittedOn: -1 }); // Edit permission queries
applicationSchema.index({ createdAt: -1 }); // Creation date sorting

module.exports = mongoose.model('Application', applicationSchema);
