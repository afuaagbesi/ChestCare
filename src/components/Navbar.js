import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaCog,
  FaUser,
  //FaPlus,
  FaUpload,
  FaMoon,
  FaSun,
  FaHome,
  FaUserCog
} from "react-icons/fa";

function Navbar({ toggleDarkMode, isDarkMode, doctorName = "Smith" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear session, tokens, etc.)
    navigate("/login"); // Redirect to login page after logout
  };

  // Determine if a nav item is active
  const isActive = (path) => {
    return location.pathname === path 
      ? "border-l-4 border-blue-300 bg-blue-800 dark:bg-blue-900" 
      : "";
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-blue-900 dark:bg-gray-900 text-gray-100 shadow-lg flex flex-col transition-colors duration-300">
      {/* Logo and Doctor name */}
      <div className="p-6 border-b border-blue-800 dark:border-gray-800">
        <h1 className="text-xl font-medium mb-1 text-white">ChestCare</h1>
        <p className="text-blue-200 dark:text-gray-300 text-sm font-light">Hello Dr. {doctorName}</p>
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow py-4 overflow-y-auto">
        <div className="space-y-1">
          <button
            className={`flex items-center w-full px-6 py-3 hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200 ${
              isActive("/doctordashboard")
            }`}
            onClick={() => navigate("/doctordashboard")}
          >
            <FaHome className="mr-3 text-blue-300 dark:text-blue-400" />
            <span className="font-light">Dashboard</span>
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200 ${
              isActive("/patients")
            }`}
            onClick={() => navigate("/patients")}
          >
            <FaUser className="mr-3 text-blue-300 dark:text-blue-400" />
            <span className="font-light">Patients</span>
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200 ${
              isActive("/upload-xray")
            }`}
            onClick={() => navigate("/upload-xray")}
          >
            <FaUpload className="mr-3 text-blue-300 dark:text-blue-400" />
            <span className="font-light">Upload X-ray</span>
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200 ${
              isActive("/profile")
            }`}
            onClick={() => navigate("/profile")}
          >
            <FaUserCog className="mr-3 text-blue-300 dark:text-blue-400" />
            <span className="font-light">Profile</span>
          </button>

          <button
            className={`flex items-center w-full px-6 py-3 hover:bg-blue-800 dark:hover:bg-gray-800 transition-colors duration-200 ${
              isActive("/settings")
            }`}
            onClick={() => navigate("/settings")}
          >
            <FaCog className="mr-3 text-blue-300 dark:text-blue-400" />
            <span className="font-light">Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-blue-800 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-blue-200 dark:text-gray-300 font-light">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${
              isDarkMode ? "bg-blue-600" : "bg-blue-700 dark:bg-gray-700"
            }`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 flex items-center justify-center ${
                isDarkMode ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {isDarkMode ? (
                <FaMoon className="text-blue-700 text-xs" />
              ) : (
                <FaSun className="text-yellow-500 text-xs" />
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 bg-blue-800 dark:bg-gray-800 hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3 text-blue-300 dark:text-blue-400" />
          <span className="font-light">Logout</span>
        </button>
      </div>

      {/* Add padding to ensure content isn't hidden behind navbar */}
      <div className="w-64 flex-shrink-0"></div>
    </div>
  );
}

export default Navbar;