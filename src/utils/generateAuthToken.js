const jwt = require('jsonwebtoken');

function generateAuthToken(employee) {
    const payload = {
        id: employee._id,
        email: employee.email,
        role: employee.role
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const options = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, secret, options);
}

module.exports = generateAuthToken;
