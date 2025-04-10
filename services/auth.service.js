// services/auth.service.js
const User = require("../models/User.model");
const University = require("../models/University.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// services/auth.service.js
const { sendVerificationEmail } = require("./email.service");

// Register a new user
const register = async (email, password, role, universityDomain) => {
  // 1. Validate university domain
  const university = await University.findOne({ domain: universityDomain });
  if (!university) throw new Error("University not whitelisted");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    universityId: university._id,
  });

  //   const token = user.generateVerificationToken();
  //   await sendVerificationEmail(email, token); // Send email

  const token = user.generateVerificationToken();
  console.log("Verification token (for testing):", token); // Log token instead of sending email

  return user;
};

// Login user
const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { user, token };
};

module.exports = { register, login };
