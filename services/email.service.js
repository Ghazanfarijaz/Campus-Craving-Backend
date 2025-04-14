require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  const msg = { to, from: process.env.EMAIL_FROM, subject, html };
  await sgMail.send(msg);
};

const sendVerificationEmail = async (email, token) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SendGrid API key is missing");
    }

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || "no-reply@campuscravings.com",
      subject: "Verify Your Campus Cravings Account",
      html: `Click <a href="${process.env.BASE_URL}/api/verify-email?token=${token}">here</a> to verify your email.`,
    };

    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (err) {
    console.error(
      "Failed to send verification email:",
      err.response?.body || err.message
    );
    throw new Error("Failed to send verification email");
  }
};

const sendPasswordResetEmail = (email, token) => {
  const subject = "Password Reset Request";
  const html = `
    <h2>Reset Password</h2>
    <p>Click <a href="${
      process.env.FRONTEND_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(
    email
  )}">here</a> to reset.</p>
    <p>Or enter this code manually: ${token}</p>
  `;
  return sendEmail(email, subject, html);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
