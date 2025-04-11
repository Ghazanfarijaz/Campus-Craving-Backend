// services/password.service.js
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("./email.service");

const generateResetToken = () => crypto.randomBytes(20).toString("hex");

module.exports = { generateResetToken };
