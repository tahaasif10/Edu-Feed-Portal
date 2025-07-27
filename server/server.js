// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const FeedRoute = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); // Login route
app.use("/api/feedback", FeedRoute); // Feedback routes

app.get("/", (req, res) => {
  res.send("Student Management System API is running");
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/student-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
