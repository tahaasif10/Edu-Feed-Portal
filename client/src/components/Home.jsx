import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield } from 'lucide-react'; // lucide icons

const Home = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    if (role === 'student') {
      navigate('/feedbackpage');
    } else if (role === 'admin') {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
          Welcome 
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Please select your role to continue
        </p>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => handleSelection('student')}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300"
          >
            <GraduationCap className="w-5 h-5" />
            I'm a Student
          </button>
          <button
            onClick={() => handleSelection('admin')}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300"
          >
            <Shield className="w-5 h-5" />
            I'm an Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
