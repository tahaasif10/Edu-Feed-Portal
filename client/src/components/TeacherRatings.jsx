import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Star, BookOpen, TrendingUp } from 'lucide-react';

const TeacherRatings = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  useEffect(() => {
    fetchTeacherRatings();
  }, [selectedSemester]);

  useEffect(() => {
    filterTeachers();
  }, [searchQuery, teachers]);

  const fetchTeacherRatings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSemester !== 'All') {
        params.semester = selectedSemester;
      }
      
      const res = await axios.get('http://localhost:5000/api/teacher-ratings', { params });
      console.log('Teacher ratings data:', res.data); // Debug log
      setTeachers(res.data);
      setFilteredTeachers(res.data);
    } catch (err) {
      console.error('Error fetching teacher ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTeachers = () => {
    if (!searchQuery.trim()) {
      setFilteredTeachers(teachers);
      return;
    }

    const filtered = teachers.filter(teacher =>
      teacher.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const toggleExpand = (teacherName) => {
    setExpandedTeacher(expandedTeacher === teacherName ? null : teacherName);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? 'text-yellow-500 fill-yellow-500'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-500 fill-yellow-500 opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 font-bold text-gray-700">{rating}/5</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
        <div className="text-xl text-gray-600">Loading teacher ratings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-extrabold text-gray-900">
              Teacher Ratings & Reviews
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            See what students say about their teachers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search teacher name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700 text-lg">
            Found <span className="font-bold text-blue-600">{filteredTeachers.length}</span> teacher(s)
          </p>
        </div>

        {/* Teacher Cards */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No teachers found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try submitting some feedback first or change filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.teacherName}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Teacher Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        👨‍🏫 {teacher.teacherName}
                      </h2>
                      <div className="flex items-center gap-4">
                        {renderStars(parseFloat(teacher.averageRating))}
                        <span className="text-gray-600">
                          ({teacher.totalRatings} review{teacher.totalRatings !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Courses Taught */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Teaches:</h3>
                    <div className="flex flex-wrap gap-2">
                      {teacher.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Feedback Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Feedback:</h3>
                    {teacher.feedbacks.slice(0, 2).map((feedback, idx) => (
                      <div key={idx} className="mb-3 last:mb-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`inline h-4 w-4 ${
                                  i < feedback.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mt-1 italic">
                          "{feedback.comments}"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {feedback.courseName} • {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* View All Button */}
                  {teacher.feedbacks.length > 2 && (
                    <button
                      onClick={() => toggleExpand(teacher.teacherName)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                      {expandedTeacher === teacher.teacherName
                        ? 'Show Less'
                        : `View All ${teacher.feedbacks.length} Reviews`}
                    </button>
                  )}
                </div>

                {/* Expanded Reviews */}
                {expandedTeacher === teacher.teacherName && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All Reviews</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {teacher.feedbacks.map((feedback, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`inline h-4 w-4 ${
                                    i < feedback.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {feedback.courseName}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">"{feedback.comments}"</p>
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherRatings;