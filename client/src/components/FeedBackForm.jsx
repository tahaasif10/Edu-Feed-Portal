import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    rating: "",
    comments: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        // Using a custom message box instead of alert()
        alert("Feedback submitted successfully!"); // Placeholder for custom message box
        navigate("/thankyou");
      } else {
        alert("Error: " + (data.error || "Submission failed")); // Placeholder for custom message box
      }
    } catch (err) {
      alert("Something went wrong"); // Placeholder for custom message box
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl border border-blue-200 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          Course Feedback
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-blue-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition duration-200"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-blue-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition duration-200"
                placeholder="you@example.com"
              />
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-base font-semibold text-blue-700 mb-2">Course Name</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition duration-200"
                placeholder="e.g. Web Development Fundamentals"
              />
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-base font-semibold text-blue-700 mb-2">Rating (1 to 5)</label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-blue-300 rounded-lg bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 transition duration-200 cursor-pointer appearance-none pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5rem auto' }}
              >
                <option value="" disabled>Select a rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-base font-semibold text-blue-700 mb-2">Comments & Suggestions</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-5 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 resize-y transition duration-200"
              placeholder="Share your detailed experience and suggestions for improvement..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
