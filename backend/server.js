const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://10.183.61.172:3000",
    "https://localhost:3000",
    "https://10.183.61.172:3000",
    "http://localhost:3001",
    "http://10.183.61.172:3001",
    "https://localhost:3001",
    "https://10.183.61.172:3001"
  ],
  credentials: true
})); // Enable CORS for frontend (HTTP and HTTPS)
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api", require("./routes/api"));

// Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wms_test")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Warehouse Management System API - Server Running ✅" });
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile access: http://YOUR_IP:${PORT}`);
});