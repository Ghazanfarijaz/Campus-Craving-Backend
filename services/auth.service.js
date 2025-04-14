const User = require("../models/User.model");
const University = require("../models/University.model");
const { sendVerificationEmail } = require("./email.service");
const jwt = require("jsonwebtoken");

class AuthService {
  static async register({
    firstName,
    lastName,
    email,
    password,
    role,
    universityDomain,
  }) {
    try {
      // 1. Validate university
      const university = await University.findOne({ domain: universityDomain });
      if (!university) {
        console.log("University not found for domain:", universityDomain);
        throw new Error("University not whitelisted");
      }

      // 2. Check existing user
      if (await User.isEmailTaken(email)) {
        console.log("Email already exists:", email);
        throw new Error("Email already taken");
      }

      // 3. Create user
      const user = await User.create(
        await User.newEntity({
          firstName,
          lastName,
          email,
          password,
          role,
          universityId: university._id,
        })
      );
      console.log("User created successfully:", user.email);

      // 4. Generate token
      const token = user.generateVerificationToken();
      console.log("Generated token:", token);

      // 5. Send email
      await sendVerificationEmail(email, token);
      console.log("Verification email sent to:", email);

      return user;
    } catch (err) {
      console.error("Registration error:", err);
      throw err; // This will be caught by the controller
    }
  }

  static async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await User.isPasswordMatch(user, password))) {
      throw new Error("Invalid credentials");
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email first");
    }

    // Create token with more unique data
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        lastLogin: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Update last access
    user.lastAccess = new Date();
    await user.save();

    return { user, token };
  }
}

module.exports = AuthService;
