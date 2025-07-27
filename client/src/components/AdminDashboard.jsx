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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-blue-800 text-center sm:text-left">
            Admin Dashboard
          </h1>
          {/* <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Logout
          </button> */}
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
          <div className="overflow-auto rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedFeedbacks.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-semibold">
                      {item.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                      {item.rating}/5
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.comments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
