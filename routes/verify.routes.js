const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Add this import
const User = require("../models/User.model");

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(
      token,
      process.env.VERIFY_EMAIL_SECRET || "test_secret"
    ); // Fallback for testing
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.send("Email verified successfully!");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
});

module.exports = router;
