// Test script (test-update.js)
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

async function testPasswordUpdate() {
  // 1. Find user
  const user = await User.findOne({ email: "i200870@nu.edu.pk" });

  // 2. Manually set and save password
  user.password = "hello234";
  await user.save();

  // 3. Verify the hash
  console.log("Stored hash:", user.password);

  // 4. Test comparison
  const isMatch = await bcrypt.compare("hello234", user.password);
  console.log("Password match:", isMatch);
}

testPasswordUpdate();
