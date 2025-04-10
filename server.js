require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = require("./config/db");
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Campus Cravings Backend is running!");
});

// Auth Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Email Verification Routes
const verifyRoutes = require("./routes/verify.routes");
app.use("/api", verifyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle port already in use
process.on("uncaughtException", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is already in use. Trying another port...`);
    server.listen(0); // Let OS assign a free port
  } else {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  }
});
