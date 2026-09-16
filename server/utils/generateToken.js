const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given user ID
 * @param {string} userId 
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'campustales_fallback_secret_key_2025',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

module.exports = generateToken;
