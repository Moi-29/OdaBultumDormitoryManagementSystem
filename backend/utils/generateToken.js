const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    // Support both old format (just id) and new format (object with id, role, etc.)
    const tokenPayload = typeof payload === 'object' ? payload : { id: payload };
    
    return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
