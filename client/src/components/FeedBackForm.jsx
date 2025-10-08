import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FeedbackForm = () => {
  const [studentData, setStudentData] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('studentToken');
    const storedStudent = sessionStorage.getItem('studentData');

    if (!token || !storedStudent) {
      alert('Please login first to submit feedback');
      navigate('/student/login');
      return;
    }

    setStudentData(JSON.parse(storedStudent));
  }, [navigate]);

  useEffect(() => {
    if (selectedSemester) {
      fetchCourses();
    } else {
      setCourses([]);
      setSelectedCourse(null);
    }
  }, [selectedSemester]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses?semester=${selectedSemester}&department=Computer Science`
      );
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCourse) {
      setError("Please select a course");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/feedback", {
        studentId: studentData.studentId,
        courseId: selectedCourse._id,
        rating: parseInt(rating),
        comments
      });

      if (res.status === 201) {
        navigate("/thankyou");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-xl border border-blue-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          Course Feedback
        </h2>

        {/* Student Info Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-blue-700">Student ID:</span>
              <p className="text-gray-700">{studentData.studentId}</p>
            </div>
            <div>
              <span className="font-semibold text-blue-700">Name:</span>
              <p className="text-gray-700">{studentData.name}</p>
            </div>
            <div className="col-span-2">
              <span className="font-semibold text-blue-700">Email:</span>
              <p className="text-gray-700">{studentData.email}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Select Semester */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
            <label className="block text-lg font-bold text-blue-800 mb-3">
              📚 STEP 1: Select Your Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setSelectedCourse(null);
                setError("");
              }}
              required
              className="w-full px-5 py-3 border-2 border-blue-300 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-3 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Choose Semester...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          {/* STEP 2: Select Course */}
          {selectedSemester && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
              <label className="block text-lg font-bold text-indigo-800 mb-3">
                📖 STEP 2: Select Course
              </label>
              
              {loadingCourses ? (
                <div className="text-center py-4 text-gray-600">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No courses available for this semester</div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {courses.map(course => (
                    <label
                      key={course._id}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCourse?._id === course._id
                          ? 'border-indigo-600 bg-indigo-100'
                          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="course"
                        value={course._id}
                        checked={selectedCourse?._id === course._id}
                        onChange={() => {
                          setSelectedCourse(course);
                          setError("");
                        }}
                        className="mt-1 h-5 w-5 text-indigo-600"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-semibold text-gray-800">{course.courseName}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          👨‍🏫 Teacher: <span className="font-medium">{course.teacher}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Rating & Comments */}
          {selectedCourse && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
              <label className="block text-lg font-bold text-purple-800 mb-4">
                ⭐ STEP 3: Rate & Review
              </label>

              {/* Selected Course Display */}
              <div className="bg-white border border-purple-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">You are reviewing:</p>
                <p className="font-bold text-gray-800 text-lg">{selectedCourse.courseName}</p>
                <p className="text-sm text-gray-600">Teacher: {selectedCourse.teacher}</p>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label htmlFor="rating" className="block text-base font-semibold text-purple-700 mb-2">
                  Rating (1 to 5) <span className="text-red-500">*</span>
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                  className="w-full px-5 py-3 border-2 border-purple-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="" disabled>Select rating for teacher...</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5) - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ (4) - Good</option>
                  <option value="3">⭐⭐⭐ (3) - Average</option>
                  <option value="2">⭐⭐ (2) - Below Average</option>
                  <option value="1">⭐ (1) - Poor</option>
                </select>
              </div>

              {/* Comments */}
              <div>
                <label htmlFor="comments" className="block text-base font-semibold text-purple-700 mb-2">
                  Comments & Suggestions <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                  rows="5"
                  className="w-full px-5 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-500 text-gray-800 placeholder-gray-400 resize-y"
                  placeholder="Share your experience with this teacher and course..."
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 font-bold rounded-lg shadow-md transition duration-300"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCourse}
              className={`flex-1 py-4 font-bold rounded-lg shadow-md transition duration-300 ${
                loading || !selectedCourse
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-700 hover:bg-blue-800 hover:shadow-lg'
              } text-white`}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
