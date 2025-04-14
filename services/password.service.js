const User = require("../models/User.model");
const { sendPasswordResetEmail } = require("./email.service");

class PasswordService {
  static async requestReset(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, token);
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid or expired token");

    user.password = await utils.setPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}

module.exports = PasswordService;
