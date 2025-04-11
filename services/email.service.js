// // services/email.service.js
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendVerificationEmail = async (email, verificationToken) => {
//   const msg = {
//     to: email,
//     from: "no-reply@campuscravings.com",
//     subject: "Verify Your Campus Cravings Account",
//     html: `
//       <h2>Welcome to Campus Cravings!</h2>
//       <p>Click <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.</p>
//     `,
//   };

//   await sgMail.send(msg);
// };

// module.exports = { sendVerificationEmail };

// services/email.service.js
const nodemailer = require("nodemailer");

// Configure transporter (using Gmail for testing)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASSWORD, // Gmail app password
  },
});

// Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Campus Cravings Account",
    html: `
      <h2>Welcome to Campus Cravings!</h2>
      <p>Click <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h2>Reset Your Password</h2>
      <p>Click <a href="${process.env.BASE_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
