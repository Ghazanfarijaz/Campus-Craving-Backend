// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   login,
//   requestPasswordReset,
//   resetPassword,
// } = require("../controllers/auth.controller");

// router.post("/register", register);
// router.post("/login", login);
// router.post("/forgot-password", requestPasswordReset);
// router.post("/reset-password", resetPassword);

// module.exports = router;

const jwt = require("jsonwebtoken"); // Add this at the top
const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  resendOTP,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const passport = require("passport");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Add with other routes
router.post("/update-password", protect, updatePassword);

// Add with other routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Successful response options:

      // Option 1: Return JSON (best for API)
      res.json({
        success: true,
        token,
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
      });

      // OR Option 2: Redirect to frontend (if you have one)
      // res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    } catch (err) {
      console.error("JWT generation error:", err);
      res.status(500).json({
        success: false,
        error: "Authentication failed",
      });
    }
  }
);

module.exports = router;
