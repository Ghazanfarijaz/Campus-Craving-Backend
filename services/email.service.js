// services/email.service.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: "no-reply@campuscravings.com",
    subject: "Verify Your Campus Cravings Account",
    html: `
      <h2>Welcome to Campus Cravings!</h2>
      <p>Click <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">here</a> to verify your email.</p>
    `,
  };

  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail };
