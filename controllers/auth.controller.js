// controllers/auth.controller.js
const { register, login } = require("../services/auth.service");

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, universityDomain } = req.body;
    const user = await register(email, password, role, universityDomain);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.status(200).json({ success: true, token, data: user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
};
