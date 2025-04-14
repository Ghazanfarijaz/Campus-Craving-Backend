require("dotenv").config();
const { sendOTPSMS } = require("../services/otp.service");

(async () => {
  try {
    await sendOTPSMS("+923245402097", "989898"); // Replace with your phone number
    console.log("SMS sent successfully!");
  } catch (err) {
    console.error("Test failed:", err.message);
  }
})();
