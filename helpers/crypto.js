const bcrypt = require("bcryptjs");
const saltRounds = 12;

module.exports = {
  /**
   * Hash a plaintext password
   * @param {string} plainPassword
   * @returns {Promise<string>} hashed password
   */
  async hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, saltRounds);
  },

  /**
   * Compare plaintext with hashed password
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>} match result
   */
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Generate random OTP
   * @param {number} length - OTP length (default: 6)
   * @returns {string} generated OTP
   */
  generateOTP(length = 6) {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    ).toString();
  },
};
