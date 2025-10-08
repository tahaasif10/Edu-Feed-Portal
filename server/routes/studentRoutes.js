const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const protect = require('../middleware/auth');

// GET all students - Protected (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Add a new student - Protected (admin only)
router.post('/', protect, async (req, res) => {
  const { studentId, name, email, department } = req.body;

  if (!studentId || !name || !email) {
    return res.status(400).json({ error: 'Student ID, name, and email are required' });
  }

  try {
    const existingStudent = await Student.findOne({ studentId: studentId.toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID already exists' });
    }

    const student = new Student({ 
      studentId: studentId.toUpperCase(), 
      name, 
      email: email.toLowerCase(),
      department 
    });
    
    await student.save();
    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Student ID or Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Verify if student ID exists (Public route for feedback form)
router.post('/verify', async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const student = await Student.findOne({ 
      studentId: studentId.toUpperCase(),
      isActive: true 
    });

    if (!student) {
      return res.status(404).json({ error: 'Student ID not found or inactive' });
    }

    res.json({ 
      valid: true, 
      student: { 
        studentId: student.studentId, 
        name: student.name, 
        email: student.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a student - Protected (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;