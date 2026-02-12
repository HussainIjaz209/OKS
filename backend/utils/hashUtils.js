const crypto = require('crypto');

/**
 * Hash a password using SHA-256.
 * @param {string} password - The plain text password.
 * @returns {string} - The SHA-256 hash of the password.
 */
const hashSHA256 = (password) => {
    if (!password) return null;
    return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} enteredPassword - The plain text password to check.
 * @param {string} storedHash - The stored SHA-256 hash.
 * @returns {boolean} - True if match, false otherwise.
 */
const comparePassword = (enteredPassword, storedHash) => {
    if (!enteredPassword || !storedHash) return false;
    const computedHash = hashSHA256(enteredPassword);
    return computedHash === storedHash;
};

module.exports = { hashSHA256, comparePassword };
