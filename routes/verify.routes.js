const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    // Verify token
    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET);

    // Update user
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Redirect to success page or send response
    res.send(`
      <h1>Email Verified Successfully!</h1>
      <p>You can now close this window and log in to your account.</p>
    `);
  } catch (err) {
    console.error("Verification error:", err);
    res.status(400).send(`
      <h1>Verification Failed</h1>
      <p>${err.message}</p>
      <p>The verification link may have expired or is invalid.</p>
    `);
  }
});

module.exports = router;
