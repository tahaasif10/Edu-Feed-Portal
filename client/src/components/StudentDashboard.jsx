import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, BookOpen, Star, Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('studentToken');
    const storedStudent = sessionStorage.getItem('studentData');

    if (!token || !storedStudent) {
      navigate('/student/login');
      return;
    }

    setStudentData(JSON.parse(storedStudent));

    const fetchFeedbacks = async () => {
      try {
        const student = JSON.parse(storedStudent);
        const res = await axios.get(
          `http://localhost:5000/api/feedback/student/${student.studentId}`
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('studentToken');
    sessionStorage.removeItem('studentData');
    navigate('/student/login');
  };

  const calculateStats = () => {
    if (feedbacks.length === 0) return { avgRating: 0, totalFeedbacks: 0 };
    const avgRating = (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1);
    return { avgRating, totalFeedbacks: feedbacks.length };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 px-4 sm:px-6 lg:px-8 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-800">
                Welcome, {studentData?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {studentData?.studentId} • {studentData?.department}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Feedbacks</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalFeedbacks}</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.avgRating}</p>
              </div>
              <Star className="h-12 w-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-center h-full">
              <button
                onClick={() => navigate('/student/feedback')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <PlusCircle className="h-5 w-5" />
                Submit New Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Feedback History</h2>

          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No feedback submitted yet</p>
              <button
                onClick={() => navigate('/student/feedback')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Submit Your First Feedback
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Semester {feedback.courseId?.semester}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-blue-700">
                        {feedback.courseId?.courseName || 'Course Deleted'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        👨‍🏫 Teacher: <span className="font-medium">{feedback.courseId?.teacher || 'N/A'}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {feedback.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-gray-700 text-sm leading-relaxed">{feedback.comments}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
