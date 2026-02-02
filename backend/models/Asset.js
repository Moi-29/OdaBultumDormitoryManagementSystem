const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Furniture', 'Electronics', 'Linen', 'supplies', 'Other'],
        required: true
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Poor', 'Broken'],
        default: 'Good'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    assignedToRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    value: {
        type: Number, // Estimated value in ETB
        default: 0
    },
    purchaseDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
