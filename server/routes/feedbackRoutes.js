const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const Student = require('../models/Student');
const protect = require('../middleware/auth');

// POST /api/feedback — Submit feedback (Student must be logged in)
router.post('/', async (req, res) => {
  const { studentId, courseId, rating, comments } = req.body;

  if (!studentId || !courseId || !rating || !comments) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Verify student exists
    const student = await Student.findOne({ 
      studentId: studentId.toUpperCase(),
      isActive: true 
    });

    if (!student) {
      return res.status(400).json({ error: 'Invalid Student ID' });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(400).json({ error: 'Invalid or inactive course' });
    }

    // Check if student already submitted feedback for this course
    const existingFeedback = await Feedback.findOne({
      studentId: studentId.toUpperCase(),
      courseId: courseId
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        error: 'You have already submitted feedback for this course.' 
      });
    }

    // Create feedback
    const feedback = new Feedback({ 
      studentId: studentId.toUpperCase(), 
      courseId,
      rating, 
      comments
    });
    
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });

  } catch (err) {
    console.error('Feedback submission error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'You have already submitted feedback for this course.' 
      });
    }
    
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/feedback — Get all feedbacks (Admin only) - Populate course details
router.get('/', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('courseId', 'courseName teacher semester department')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/feedback/student/:studentId - Get feedbacks by student (for student dashboard)
router.get('/student/:studentId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ 
      studentId: req.params.studentId.toUpperCase() 
    })
      .populate('courseId', 'courseName teacher semester department')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching student feedbacks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/feedback/:id — Delete feedback (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error("Server error while deleting:", err);
    res.status(500).json({ message: "Error deleting feedback." });
  }
});

module.exports = router;