import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-sky-800 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">Feedback Management System</h1>
      <div className="space-x-4">
        <Link to="/admin/login" className="hover:underline">
          Admin
        </Link>
        <Link to="/" className="hover:underline">
          Form
        </Link>
        {/* Uncomment this when you need logout */}
        {/* <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
            Logout
          </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
