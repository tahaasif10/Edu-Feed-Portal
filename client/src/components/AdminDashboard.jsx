import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterSemester, setFilterSemester] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
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
    
    if (filterSemester !== 'All') {
      currentFeedbacks = currentFeedbacks.filter(
        item => item.courseId?.semester === parseInt(filterSemester)
      );
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
  }, [feedbacks, filterSemester, sortOrder]);

  const calculateStats = () => {
    const total = feedbacks.length;
    const avgRating = total > 0 
      ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1)
      : 0;
    return { total, avgRating };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Total Feedbacks: <span className="font-bold">{stats.total}</span> | 
              Average Rating: <span className="font-bold">{stats.avgRating}/5</span>
            </p>
          </div>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="semesterFilter" className="block text-sm font-medium text-blue-700 mb-2">
              Filter by Semester:
            </label>
            <select
              id="semesterFilter"
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full p-3 border border-blue-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
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
              className="w-full p-3 border border-blue-300 rounded-md bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Teacher
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {item.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                        Sem {item.courseId?.semester || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-700 font-semibold max-w-xs">
                      {item.courseId?.courseName || 'Deleted Course'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {item.courseId?.teacher || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                      {item.rating}/5
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
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
