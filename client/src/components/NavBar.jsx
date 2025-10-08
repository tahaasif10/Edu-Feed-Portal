import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    navigate("/admin/login");
  };

  const handleStudentLogout = () => {
    sessionStorage.removeItem("studentToken");
    sessionStorage.removeItem("studentData");
    navigate("/student/login");
  };

  const isAdminDashboard = location.pathname === "/admin/dashboard";
  const isStudentDashboard = location.pathname === "/student/dashboard";
  const isStudentFeedback = location.pathname === "/student/feedback";

  // Check if student is logged in
  const studentToken = sessionStorage.getItem("studentToken");
  const isStudentLoggedIn = !!studentToken;

  return (
    <>
      {/* Desktop vertical layout (except for dashboard pages) */}
      {!isAdminDashboard && !isStudentDashboard && !isStudentFeedback && (
        <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-sky-800 text-white flex-col justify-between p-6 shadow-lg z-50">
          <div>
            <h1 className="text-2xl font-bold mb-10">Feedback System</h1>
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-lg hover:text-sky-200 transition font-medium"
              >
                Home
              </Link>
              <Link
                to="/teachers"
                className="text-lg hover:text-sky-200 transition font-medium"
              >
                Teacher Ratings
              </Link>
            </nav>
          </div>
        </aside>
      )}

      {/* Horizontal layout (for dashboard and mobile) */}
      <nav
        className={`${
          isAdminDashboard || isStudentDashboard || isStudentFeedback ? "flex" : "flex md:hidden"
        } fixed top-0 left-0 right-0 h-16 bg-sky-800 text-white items-center justify-between px-6 shadow-md z-50`}
      >
        <h1 className="text-lg font-bold">Feedback System</h1>
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="text-sm hover:text-sky-200 font-medium"
          >
            Home
          </Link>

          {/* Admin logout */}
          {isAdminDashboard && (
            <button
              onClick={handleAdminLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
            >
              Logout
            </button>
          )}

          {/* Student logout */}
          {(isStudentDashboard || isStudentFeedback) && isStudentLoggedIn && (
            <button
              onClick={handleStudentLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
