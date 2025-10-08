const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');

// GET /api/teacher-ratings - Get all teacher ratings (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { search, semester } = req.query;

    // Get all courses
    let courseQuery = { isActive: true };
    if (semester) {
      courseQuery.semester = parseInt(semester);
    }
    const courses = await Course.find(courseQuery);

    // Get all feedbacks with course details
    const feedbacks = await Feedback.find()
      .populate('courseId', 'courseName teacher semester department')
      .sort({ createdAt: -1 });

    // Group feedbacks by teacher
    const teacherMap = {};

    feedbacks.forEach(feedback => {
      if (!feedback.courseId) return; // Skip if course was deleted

      const teacher = feedback.courseId.teacher;
      
      if (!teacherMap[teacher]) {
        teacherMap[teacher] = {
          teacherName: teacher,
          totalRatings: 0,
          totalScore: 0,
          averageRating: 0,
          feedbacks: [],
          courses: new Set()
        };
      }

      teacherMap[teacher].totalRatings++;
      teacherMap[teacher].totalScore += feedback.rating;
      teacherMap[teacher].feedbacks.push({
        rating: feedback.rating,
        comments: feedback.comments,
        courseName: feedback.courseId.courseName,
        semester: feedback.courseId.semester,
        createdAt: feedback.createdAt
      });
      teacherMap[teacher].courses.add(
        `${feedback.courseId.courseName} (Sem ${feedback.courseId.semester})`
      );
    });

    // Calculate average ratings and convert to array
    let teacherRatings = Object.values(teacherMap).map(teacher => {
      teacher.averageRating = (teacher.totalScore / teacher.totalRatings).toFixed(1);
      teacher.courses = Array.from(teacher.courses);
      // Sort feedbacks by date (newest first)
      teacher.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return teacher;
    });

    // Filter by search query if provided
    if (search) {
      teacherRatings = teacherRatings.filter(teacher =>
        teacher.teacherName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by average rating (highest first)
    teacherRatings.sort((a, b) => b.averageRating - a.averageRating);

    res.json(teacherRatings);
  } catch (err) {
    console.error('Error fetching teacher ratings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/teacher-ratings/:teacherName - Get specific teacher details
router.get('/:teacherName', async (req, res) => {
  try {
    const teacherName = decodeURIComponent(req.params.teacherName);

    // Get all feedbacks for this teacher
    const feedbacks = await Feedback.find()
      .populate('courseId', 'courseName teacher semester department')
      .sort({ createdAt: -1 });

    const teacherFeedbacks = feedbacks.filter(
      fb => fb.courseId && fb.courseId.teacher === teacherName
    );

    if (teacherFeedbacks.length === 0) {
      return res.status(404).json({ error: 'No ratings found for this teacher' });
    }

    // Calculate statistics
    const totalRatings = teacherFeedbacks.length;
    const totalScore = teacherFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = (totalScore / totalRatings).toFixed(1);

    // Rating distribution
    const ratingDistribution = {
      5: teacherFeedbacks.filter(fb => fb.rating === 5).length,
      4: teacherFeedbacks.filter(fb => fb.rating === 4).length,
      3: teacherFeedbacks.filter(fb => fb.rating === 3).length,
      2: teacherFeedbacks.filter(fb => fb.rating === 2).length,
      1: teacherFeedbacks.filter(fb => fb.rating === 1).length
    };

    // Get unique courses
    const courses = [...new Set(teacherFeedbacks.map(
      fb => `${fb.courseId.courseName} (Sem ${fb.courseId.semester})`
    ))];

    // Format feedbacks (without student IDs)
    const formattedFeedbacks = teacherFeedbacks.map(fb => ({
      rating: fb.rating,
      comments: fb.comments,
      courseName: fb.courseId.courseName,
      semester: fb.courseId.semester,
      createdAt: fb.createdAt
    }));

    res.json({
      teacherName,
      averageRating,
      totalRatings,
      ratingDistribution,
      courses,
      feedbacks: formattedFeedbacks
    });
  } catch (err) {
    console.error('Error fetching teacher details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;