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

const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
