require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000; // Fallback port

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend/build")));

// API Routes
app.use("/api", userRoutes);

// Fallback to serve index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});