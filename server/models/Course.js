const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  department: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Software Engineering'],
    default: 'Computer Science'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure no duplicate courses in same semester for same department
CourseSchema.index({ courseName: 1, semester: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);