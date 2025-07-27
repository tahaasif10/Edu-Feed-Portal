// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const protect = require('../middleware/auth'); // This is your JWT auth middleware

// POST /api/feedback — public route
router.post('/', async (req, res) => {
  const { name, email, comments, course, rating } = req.body;

  if (!name || !email || !comments || !course || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const feedback = new Feedback({ name, email, comments, course, rating });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/feedback/:id — protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

await Feedback.findByIdAndDelete(req.params.id);
res.status(200).json({ message: 'Feedback deleted successfully' });    res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (err) {
    console.error("Server error while deleting:", err);
    res.status(500).json({ message: "Error deleting feedback." });
  }
});

// GET /api/feedback — protected route for admin
router.get('/', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
