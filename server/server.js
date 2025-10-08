const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");
const studentAuthRoutes = require("./routes/studentAuthRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const teacherRatingsRoutes = require("./routes/teacherRatingsRoutes"); // NEW

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/auth", studentAuthRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes); // NEW
app.use("/api/teacher-ratings", teacherRatingsRoutes);

app.get("/", (req, res) => {
  res.send("Feedback Management System API is running");
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/feedback", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
