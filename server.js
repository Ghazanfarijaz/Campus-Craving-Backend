// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
// const connectDB = require("./config/db");
// connectDB();

// // Routes
// app.get("/", (req, res) => {
//   res.send("Campus Cravings Backend is running!");
// });

// // Auth Routes
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

// // Email Verification Routes
// const verifyRoutes = require("./routes/verify.routes");
// app.use("/api", verifyRoutes);

// // Start Server
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle port already in use
// process.on("uncaughtException", (err) => {
//   if (err.code === "EADDRINUSE") {
//     console.log(`Port ${PORT} is already in use. Trying another port...`);
//     server.listen(0); // Let OS assign a free port
//   } else {
//     console.error("Uncaught Exception:", err);
//     process.exit(1);
//   }
// });

//===============================

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const http = require("http");

// const app = express();

// // ======================
// // 1. Middleware
// // ======================
// app.use(cors());
// app.use(express.json());

// // ======================
// // 2. Database Connection
// // ======================
// const connectDB = require("./config/db");
// connectDB().catch((err) => {
//   console.error("Database connection failed:", err);
//   process.exit(1);
// });

// // ======================
// // 3. Routes
// // ======================
// // Health Check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "active",
//     message: "Campus Cravings Backend is running!",
//   });
// });

// // Auth Routes
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

// // Email Verification Routes
// const verifyRoutes = require("./routes/verify.routes");
// app.use("/api/verify", verifyRoutes); // Changed to /api/verify for clarity

// // Password Reset Routes
// const passwordRoutes = require("./routes/password.routes");
// app.use("/api/password", passwordRoutes);

// // ======================
// // 4. Error Handling
// // ======================
// // 404 Route Not Found
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   console.error("Server error:", err.stack);
//   res.status(500).json({ error: "Internal server error" });
// });

// // ======================
// // 5. Server Initialization
// // ======================
// const PORT = process.env.PORT || 5000;
// const server = http.createServer(app);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle server errors
// server.on("error", (err) => {
//   if (err.code === "EADDRINUSE") {
//     console.log(`Port ${PORT} in use. Retrying with another port...`);
//     server.listen(0); // OS-assigned port
//   } else {
//     console.error("Server error:", err);
//     process.exit(1);
//   }
// });

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   server.close(() => {
//     mongoose.connection.close();
//     console.log("Server gracefully terminated");
//   });
// });

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

// // Auth Routes
// const authRoutes = require("./routes/auth.routes");
// app.use("/api/auth", authRoutes);

// // Email Verification Routes
// const verifyRoutes = require("./routes/verify.routes");
// app.use("/api", verifyRoutes);

// Add this with your other route imports
// const verifyRouter = require("./routes/verify.routes");
// app.use("api/verify-email", verifyRouter); // Note: No '/api' prefix here

// Add after other middleware
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/verify.routes"));

// Error handling (add at the end)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

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
