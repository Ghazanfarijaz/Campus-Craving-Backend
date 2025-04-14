require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail
  .send({
    to: "ghazzi.277@gmail.com", // Use your real email for testing
    from: "i200870@nu.edu.pk",
    subject: "Test Email",
    text: "This is a test email from Campus Cravings",
  })
  .then(() => {
    console.log("Email sent successfully!");
  })
  .catch((err) => {
    console.error("SendGrid Error:", err.response?.body || err.message);
  });
