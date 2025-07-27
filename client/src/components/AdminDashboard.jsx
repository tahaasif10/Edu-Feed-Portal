import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterCourse, setFilterCourse] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/feedback', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(res.data);
        const courses = [...new Set(res.data.map(item => item.course))];
        setUniqueCourses(['All', ...courses]);
      } catch (err) {
        alert('Session expired or unauthorized. Please log in again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(prev => prev.filter(fb => fb._id !== id));
    } catch (err) {
      alert('Failed to delete feedback. Please try again.');
    }
  };

  const filteredAndSortedFeedbacks = useMemo(() => {
    let currentFeedbacks = [...feedbacks];
    if (filterCourse !== 'All') {
      currentFeedbacks = currentFeedbacks.filter(item => item.course === filterCourse);
    }
    currentFeedbacks.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest_rating':
          return b.rating - a.rating;
        case 'lowest_rating':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    return currentFeedbacks;
  }, [feedbacks, filterCourse, sortOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center sm:text-left">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="courseFilter" className="block text-sm font-medium text-blue-700 mb-2">
              Filter by Course:
            </label>
            <select
              id="courseFilter"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
            >
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="sortOrder" className="block text-sm font-medium text-blue-700 mb-2">
              Sort By:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rating">Highest Rating</option>
              <option value="lowest_rating">Lowest Rating</option>
            </select>
          </div>
        </div>

        {filteredAndSortedFeedbacks.length === 0 ? (
          <p className="text-gray-600 text-center text-xl py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            No feedback matching your criteria.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedFeedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-blue-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-blue-700">{item.name}</h3>
                  <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {item.course}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.email}</p>

                <div className="flex items-center text-gray-700 mb-3">
                  <span className="font-semibold mr-2">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-blue-600 font-bold">{item.rating}/5</span>
                </div>

                <p className="text-gray-800 leading-relaxed mb-4 flex-grow">
                  <span className="font-semibold">Comments:</span> {item.comments}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
