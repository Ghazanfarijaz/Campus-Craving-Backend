// models/User.model.js
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Never return password in queries
    },
    role: {
      type: String,
      enum: ["student", "delivery", "restaurant", "admin"],
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// models/User.model.js
userSchema.methods.generateVerificationToken = function () {
  return jwt.sign({ id: this._id }, process.env.VERIFY_EMAIL_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = mongoose.model("User", userSchema);
