// const User = require("../models/User.model");
// const University = require("../models/University.model");
// const { sendVerificationEmail } = require("./email.service");
// const jwt = require("jsonwebtoken");

// class AuthService {
//   static async register({
//     firstName,
//     lastName,
//     email,
//     password,
//     role,
//     universityDomain,
//   }) {
//     try {
//       // 1. Validate university
//       const university = await University.findOne({ domain: universityDomain });
//       if (!university) {
//         console.log("University not found for domain:", universityDomain);
//         throw new Error("University not whitelisted");
//       }

//       // 2. Check existing user
//       if (await User.isEmailTaken(email)) {
//         console.log("Email already exists:", email);
//         throw new Error("Email already taken");
//       }

//       // 3. Create user
//       const user = await User.create(
//         await User.newEntity({
//           firstName,
//           lastName,
//           email,
//           password,
//           role,
//           universityId: university._id,
//         })
//       );
//       console.log("User created successfully:", user.email);

//       // 4. Generate token
//       const token = user.generateVerificationToken();
//       console.log("Generated token:", token);

//       // 5. Send email
//       await sendVerificationEmail(email, token);
//       console.log("Verification email sent to:", email);

//       return user;
//     } catch (err) {
//       console.error("Registration error:", err);
//       throw err; // This will be caught by the controller
//     }
//   }

//   static async login(email, password) {
//     const user = await User.findOne({ email }).select("+password");

//     if (!user || !(await User.isPasswordMatch(user, password))) {
//       throw new Error("Invalid credentials");
//     }

//     if (!user.isEmailVerified) {
//       throw new Error("Please verify your email first");
//     }

//     // Create token with more unique data
//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         universityId: user.universityId,
//         lastLogin: Date.now(),
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Update last access
//     user.lastAccess = new Date();
//     await user.save();

//     return { user, token };
//   }
// }

// module.exports = AuthService;

const User = require("../models/User.model");
const University = require("../models/University.model");
const { sendOTPEmail, sendOTPSMS } = require("./otp.service");
const jwt = require("jsonwebtoken");

class AuthService {
  static async register({
    firstName,
    lastName,
    email,
    phone,
    password,
    role,
    universityDomain,
    countryCode,
  }) {
    // 1. Validate university
    const university = await University.findOne({ domain: universityDomain });
    if (!university) throw new Error("University not whitelisted");

    // 2. Check existing user
    if (await User.isEmailTaken(email)) throw new Error("Email already taken");
    if (phone && (await User.isPhoneTaken(phone)))
      throw new Error("Phone already taken");

    // 3. Create user
    const user = await User.create(
      await User.newEntity({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        countryCode,
        universityId: university._id,
      })
    );

    // 4. Send OTP based on auth method
    if (user.authMethod === "email") {
      await sendOTPEmail(user.email, user.activationCode);
    } else if (user.authMethod === "phone") {
      await sendOTPSMS(user.phone, user.activationCode);
    }

    return user;
  }

  static async verifyOTP(emailOrPhone, otp) {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      activationCode: otp,
      activationCodeExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid OTP or expired");

    // Update verification status based on auth method
    if (user.authMethod === "email") {
      user.isEmailVerified = true;
    } else if (user.authMethod === "phone") {
      user.isPhoneVerified = true;
    }

    user.status = "active";
    user.activationCode = undefined;
    user.activationCodeExpires = undefined;
    await user.save();

    return user;
  }

  static async login(emailOrPhone, password) {
    // Find user and explicitly select password field
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Use the instance method we added to the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    if (user.status !== "active") {
      throw new Error("Account not active. Please complete verification");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Update last access time
    user.lastAccess = new Date();
    await user.save();

    return { user, token };
  }

  static async resendOTP(emailOrPhone) {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) throw new Error("User not found");

    user.activationCode = utils.randomPin(6);
    user.activationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    if (user.authMethod === "email") {
      await sendOTPEmail(user.email, user.activationCode);
    } else if (user.authMethod === "phone") {
      await sendOTPSMS(user.phone, user.activationCode);
    }

    return { message: "OTP resent successfully" };
  }
}

module.exports = AuthService;
