// const User = require("../models/User.model");
// const { sendPasswordResetEmail } = require("./email.service");

// class PasswordService {
//   static async requestReset(email) {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error("User not found");

//     const token = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     await sendPasswordResetEmail(email, token);
//   }

//   static async resetPassword(token, newPassword) {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });
//     if (!user) throw new Error("Invalid or expired token");

//     user.password = await utils.setPassword(newPassword);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();
//   }
// }

// module.exports = PasswordService;

const crypto = require("crypto");
const User = require("../models/User.model");
const { sendPasswordResetEmail } = require("./email.service");

class PasswordService {
  static async requestReset(email) {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // 2. Generate reset token (6-digit code)
    const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase();
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // 3. Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // 4. Send email
    await sendPasswordResetEmail(user.email, resetToken);

    return { message: "Reset code sent to email" };
  }

  static async resetPassword(email, token, newPassword) {
    // 1. Find user with valid token
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired reset code");

    // 2. Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password updated successfully" };
  }

  static async updatePassword(userId, currentPassword, newPassword) {
    // 1. Find user
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    // 2. Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");

    // 3. Validate new password
    if (currentPassword === newPassword) {
      throw new Error("New password must be different");
    }

    // 4. Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  }
}

module.exports = PasswordService;
