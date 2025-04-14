const AuthService = require("../services/auth.service");
const PasswordService = require("../services/password.service");

exports.register = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.email || !req.body.password || !req.body.universityDomain) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, password, universityDomain",
      });
    }

    const user = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message || "Registration failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await AuthService.login(
      req.body.email,
      req.body.password
    );
    res.json({ success: true, token, data: user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    await PasswordService.requestReset(req.body.email);
    res.json({ success: true, message: "Reset email sent" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await PasswordService.resetPassword(req.body.token, req.body.newPassword);
    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
