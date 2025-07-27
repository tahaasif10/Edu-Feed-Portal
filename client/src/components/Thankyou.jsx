// src/pages/ThankYou.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const handleNewFeedback = () => {
    navigate("/"); // Adjust this if your feedback form is at a different route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">Thank You!</h1>
        <p className="text-gray-700">Your feedback has been submitted.</p>

        <button
          onClick={handleNewFeedback}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-300"
        >
          Give Another Feedback
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
