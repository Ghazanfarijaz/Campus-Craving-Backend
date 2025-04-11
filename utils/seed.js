// utils/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const University = require("../models/University.model");

console.log("Seeding database...", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    University.create({ name: "FAST University", domain: "nu.edu.pk" })
  )
  .then(() => console.log("University seeded successfully!"))
  .catch(console.error)
  .finally(() => mongoose.disconnect());
