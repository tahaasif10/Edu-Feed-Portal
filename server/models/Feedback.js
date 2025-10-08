const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comments: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Compound index to prevent same student from submitting multiple feedbacks for same course
FeedbackSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
