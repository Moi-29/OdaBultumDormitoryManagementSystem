const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Block name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'mixed'],
        required: true
    },
    totalRooms: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 0
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'closed'],
        default: 'active'
    },
    assignedProctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proctor'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Block', blockSchema);
