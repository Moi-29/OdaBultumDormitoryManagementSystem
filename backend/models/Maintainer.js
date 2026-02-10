const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const maintainerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    specialization: {
        type: String,
        enum: ['plumbing', 'electrical', 'carpentry', 'general', 'hvac', 'cleaning'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'dismissed'],
        default: 'active'
    },
    lastLogin: {
        type: Date
    },
    lastLoginIP: {
        type: String
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    accountLockedUntil: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

// Hash password before saving
maintainerSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;
});

// Compare password method
maintainerSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if password was changed after JWT was issued
maintainerSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Check if account is locked
maintainerSchema.methods.isAccountLocked = function() {
    return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// Increment failed login attempts
maintainerSchema.methods.incrementLoginAttempts = async function() {
    if (this.accountLockedUntil && this.accountLockedUntil < Date.now()) {
        return this.updateOne({
            $set: { failedLoginAttempts: 1 },
            $unset: { accountLockedUntil: 1 }
        });
    }
    
    const updates = { $inc: { failedLoginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    if (this.failedLoginAttempts + 1 >= 5) {
        updates.$set = { accountLockedUntil: Date.now() + 2 * 60 * 60 * 1000 };
    }
    
    return this.updateOne(updates);
};

// Reset login attempts
maintainerSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: { failedLoginAttempts: 0 },
        $unset: { accountLockedUntil: 1 }
    });
};

module.exports = mongoose.model('Maintainer', maintainerSchema);
