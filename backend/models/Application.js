const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    schoolName: {
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
