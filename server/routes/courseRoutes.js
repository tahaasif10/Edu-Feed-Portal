const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const protect = require('../middleware/auth');

// GET /api/courses - Get all courses (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { semester, department } = req.query;
    
    let query = { isActive: true };
    
    if (semester) {
      query.semester = parseInt(semester);
    }
    
    if (department) {
      query.department = department;
    }
    
    const courses = await Course.find(query).sort({ semester: 1, courseName: 1 });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/courses/:id - Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses - Add new course (Admin only)
router.post('/', protect, async (req, res) => {
  const { courseName, teacher, semester, department } = req.body;

  if (!courseName || !teacher || !semester || !department) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const course = new Course({
      courseName,
      teacher,
      semester: parseInt(semester),
      department
    });

    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This course already exists in this semester' });
    }
    console.error('Error adding course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/courses/:id - Update course (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { courseName, teacher, semester, department, isActive } = req.body;
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (courseName) course.courseName = courseName;
    if (teacher) course.teacher = teacher;
    if (semester) course.semester = parseInt(semester);
    if (department) course.department = department;
    if (typeof isActive !== 'undefined') course.isActive = isActive;

    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/courses/:id - Delete course (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;