const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    phone: {
        type: String
    },
    listNumber: {
        type: Number,
        required: false
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// ⚡ PERFORMANCE INDEXES - Optimized for student queries
studentSchema.index({ studentId: 1 }, { unique: true }); // Primary key
studentSchema.index({ department: 1, year: 1, gender: 1 }); // Allocation queries
studentSchema.index({ room: 1 }); // Room assignment lookups
studentSchema.index({ gender: 1, room: 1 }); // Gender-based room queries
studentSchema.index({ year: 1, department: 1 }); // Year/department filtering

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
