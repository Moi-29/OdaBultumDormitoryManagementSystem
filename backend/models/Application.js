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
        // Basic Information
        name: String,
        fatherName: String,
        gFatherName: String,
        nameAm: String,
        fatherNameAm: String,
        gFatherNameAm: String,
        gender: String,
        dob: String,
        placeOfBirth: String,
        placeOfBirthAm: String,
        motherTongue: String,
        nationalId: String,
        healthStatus: String,
        maritalStatus: String,
        religion: String,
        // Location & Address
        citizenship: String,
        country: String,
        woreda: String,
        cityEn: String,
        cityAm: String,
        kebeleEn: String,
        kebeleAm: String,
        phone: String,
        email: String,
        poBox: String,
        // Others
        economicalStatus: String,
        areaType: String,
        tinNumber: String,
        accountNumber: String
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
        // Primary School
        primary: {
            schoolName: String,
            schoolNameAm: String,
            woreda: String,
            attendedYearFrom: String,
            attendedYearTo: String,
            schoolType: String
        },
        // Secondary School
        secondary: {
            schoolName: String,
            schoolNameAm: String,
            woreda: String,
            attendedYearFrom: String,
            attendedYearTo: String,
            schoolType: String
        }
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
        phone: String,
        email: String,
        job: String,
        woreda: String,
        homeTown: String,
        kebele: String
    },
    agreement: {
        accepted: Boolean
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
