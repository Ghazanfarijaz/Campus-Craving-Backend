const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = {
  // Password Handling
  async setPassword(password) {
    return await bcrypt.hash(password, 12);
  },
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },

  // Random Generators
  generateRandomAlphaNumeric(size = 8) {
    return crypto.randomBytes(size).toString("hex");
  },
  randomPin(length = 6) {
    return Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1)
    );
  },
};
