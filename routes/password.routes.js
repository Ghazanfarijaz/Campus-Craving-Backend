// routes/password.routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const {
  generateResetToken,
  sendPasswordResetEmail,
} = require("../services/password.service");

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = generateResetToken();
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  await sendPasswordResetEmail(email, token);

  res.json({ message: "Reset email sent" });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
