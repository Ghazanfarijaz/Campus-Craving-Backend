// // models/User.model.js
// const mongoose = require("mongoose");
// const validator = require("validator");
// const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       validate: [validator.isEmail, "Invalid email"],
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false, // Never return password in queries
//     },
//     role: {
//       type: String,
//       enum: ["student", "delivery", "restaurant", "admin"],
//       required: true,
//     },
//     universityId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "University",
//       required: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // Add toJSON method to remove sensitive data
// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   delete user.resetPasswordToken;
//   delete user.resetPasswordExpires;
//   return user;
// };

// // Generate email verification token
// userSchema.methods.generateVerificationToken = function () {
//   return jwt.sign({ id: this._id }, process.env.VERIFY_EMAIL_SECRET, {
//     expiresIn: "1d",
//   });
// };

// module.exports = mongoose.model("User", userSchema);

// const crypto = require("crypto");
// const utils = require("../utils/util");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// // Constants
// const authMethods = ["email", "google", "phone"]; // Campus Cravings supports these
// const userStatuses = ["pending", "active", "deleted", "blocked"];
// const userRoles = ["student", "delivery", "restaurant", "admin"];

// // Schema Definition
// const entity = {
//   firstName: String,
//   lastName: String,
//   fullName: String,
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     validate: {
//       validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
//       message: "Invalid email format",
//     },
//   },
//   authMethod: {
//     type: String,
//     enum: authMethods,
//     default: "email",
//   },
//   phone: String,
//   password: {
//     type: String,
//     select: false,
//   },
//   universityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "University",
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: userStatuses,
//     default: "pending",
//   },
//   role: {
//     type: String,
//     enum: userRoles,
//     required: true,
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false,
//   },
//   isPhoneVerified: {
//     type: Boolean,
//     default: false,
//   },
//   lastAccess: Date,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   activationCode: String, // For email/phone verification
//   imgUrl: String, // Profile picture
// };

// // Schema Methods
// const methods = {
//   generateVerificationToken() {
//     if (!process.env.VERIFY_EMAIL_SECRET) {
//       throw new Error("VERIFY_EMAIL_SECRET is not configured");
//     }

//     // Add more unique data to the payload
//     return jwt.sign(
//       {
//         id: this._id,
//         email: this.email, // Add email to make it more unique
//         timestamp: Date.now(), // Add current timestamp
//       },
//       process.env.VERIFY_EMAIL_SECRET,
//       { expiresIn: "1d" }
//     );
//   },
//   toJSON() {
//     const user = this.toObject();
//     delete user.password;
//     delete user.resetPasswordToken;
//     delete user.resetPasswordExpires;
//     return user;
//   },
// };

// // Static Methods
// const statics = {
//   async newEntity(body) {
//     const model = {
//       firstName: body.firstName,
//       lastName: body.lastName,
//       fullName: `${body.firstName} ${body.lastName}`,
//       email: body.email,
//       phone: body.phone,
//       role: body.role,
//       universityId: body.universityId,
//       authMethod: body.authMethod || "email",
//     };

//     if (body.password) {
//       model.password = await utils.setPassword(body.password);
//     }

//     // Campus Cravings specific defaults
//     // model.isEmailVerified = body.authMethod === "email" ? false : true;
//     // model.status = "pending";
//     (model.isEmailVerified = false), // FORCE false for all registrations
//       (model.status = "pending");

//     return model;
//   },

//   async isEmailTaken(email) {
//     return !!(await this.findOne({ email }));
//   },

//   async isPasswordMatch(user, password) {
//     return await utils.comparePassword(password, user.password);
//   },
// };

// // Create Schema
// const userSchema = new mongoose.Schema(entity, { timestamps: true });

// // Add Methods
// userSchema.methods = methods;
// userSchema.statics = statics;

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const utils = require("../utils/util");

// Constants
const authMethods = ["email", "google", "phone"];
const userStatuses = ["pending", "active", "deleted", "blocked"];
const userRoles = ["student", "delivery", "restaurant", "admin"];

// Schema Definition
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    fullName: String,
    userName: String,
    imgUrl: String,
    authMethod: {
      type: String,
      enum: authMethods,
      default: "email",
    },
    countryCode: String,
    phone: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
    activationCode: String,
    activationCodeExpires: Date,
    password: {
      type: String,
      select: false,
    },
    status: {
      type: String,
      enum: userStatuses,
      default: "pending",
    },
    role: {
      type: String,
      enum: userRoles,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    lastAccess: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance Methods
userSchema.methods = {
  generateVerificationToken() {
    return jwt.sign({ id: this._id }, process.env.VERIFY_EMAIL_SECRET, {
      expiresIn: "1d",
    });
  },

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  toJSON() {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.activationCode;
    return user;
  },
};

// Static Methods
userSchema.statics = {
  async newEntity(body) {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: `${body.firstName} ${body.lastName}`,
      userName:
        body.userName ||
        `${body.firstName}_${utils.generateRandomAlphaNumeric(4)}`,
      email: body.email,
      phone: body.phone,
      countryCode: body.countryCode,
      role: body.role || "student",
      authMethod: body.authMethod || "email",
      activationCode: utils.randomPin(6),
      activationCodeExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      isEmailVerified: false,
      isPhoneVerified: false,
      status: "pending",
      ...(body.password && { password: body.password }), // Will be hashed by pre-save hook
      googleId: String,
      facebookId: String,
    };
  },

  async isEmailTaken(email) {
    return !!(await this.findOne({ email }));
  },

  async isPhoneTaken(phone) {
    return !!(await this.findOne({ phone }));
  },
};

module.exports = mongoose.model("User", userSchema);
