const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  comments: { type: String, required: true },
  course: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
