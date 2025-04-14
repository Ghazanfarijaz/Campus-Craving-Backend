const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Twilio only if credentials exist
let twilioClient;
if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require("twilio")(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

const sendOTPEmail = async (email, otp) => {
  try {
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: "Your Campus Cravings OTP",
      text: `Your verification code is: ${otp}`,
      html: `<p>Your Campus Cravings verification code is: <strong>${otp}</strong></p>`,
    });
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
    throw new Error("Failed to send email");
  }
};

const sendOTPSMS = async (phone, otp) => {
  if (!twilioClient) {
    console.warn("Twilio credentials missing - SMS OTP disabled");
    throw new Error("SMS service not configured");
  }

  try {
    await twilioClient.messages.create({
      body: `Your Campus Cravings verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (err) {
    console.error("Twilio error:", err.message);
    throw new Error("Failed to send SMS");
  }
};

module.exports = { sendOTPEmail, sendOTPSMS };
