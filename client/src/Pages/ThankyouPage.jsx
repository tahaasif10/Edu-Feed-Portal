import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/student/dashboard");
  };

  const handleNewFeedback = () => {
    navigate("/student/feedback");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-4">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-blue-700">Thank You!</h1>
        <p className="text-gray-700">Your feedback has been submitted successfully.</p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-md transition duration-300"
          >
            Back to Dashboard
          </button>
          <button
            onClick={handleNewFeedback}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-300"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;