const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });
};

// POST /auth/student/register - Student Sign Up
router.post('/student/register', async (req, res) => {
  const { studentId, name, email, password, department } = req.body;

  // Validate required fields
  if (!studentId || !name || !email || !password || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Validate email domain
  if (!email.endsWith('@karachiuniversity.edu')) {
    return res.status(400).json({ 
      error: 'Please use your Karachi University email (@karachiuniversity.edu)' 
    });
  }

  try {
    // Check if student ID already exists
    const existingStudentId = await Student.findOne({ 
      studentId: studentId.toUpperCase() 
    });
    if (existingStudentId) {
      return res.status(400).json({ error: 'Student ID already registered' });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new student
    const student = new Student({
      studentId: studentId.toUpperCase(),
      name,
      email: email.toLowerCase(),
      password,
      department
    });

    await student.save();

    res.status(201).json({
      message: 'Account created successfully! Please login.',
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Student ID or Email already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /auth/student/login - Student Login
router.post('/student/login', async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ error: 'Student ID and password are required' });
  }

  try {
    const student = await Student.findOne({ 
      studentId: studentId.toUpperCase(),
      isActive: true 
    });

    if (!student) {
      return res.status(401).json({ error: 'Invalid Student ID or password' });
    }

    const isPasswordMatch = await student.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid Student ID or password' });
    }

    res.json({
      token: generateToken(student._id),
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /auth/student/me - Get logged-in student info
router.get('/student/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id).select('-password');
    if (!student || !student.isActive) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;