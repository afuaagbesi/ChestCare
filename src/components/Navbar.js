import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import {
  FaChartLine,
  FaUsers,
  FaUserPlus,
  FaCloudUploadAlt,
  FaUserMd,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaLungs
} from "react-icons/fa";
import DarkModeToggle from './DarkModeToggle';

function Navbar({ toggleDarkMode, isDarkMode, onCollapseChange, userRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  
  // Notify parent component when collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);
  
  const navLinks = [
    { to: '/doctordashboard', icon: <FaChartLine />, text: 'Dashboard' },
    { to: '/patients', icon: <FaUsers />, text: 'Patients' },
    { to: '/create-patient', icon: <FaUserPlus />, text: 'Create Patient' },
    { to: '/upload-xray', icon: <FaCloudUploadAlt />, text: 'Upload X-ray' },
    { to: '/profile', icon: <FaUserMd />, text: 'Profile' },
    { to: '/settings', icon: <FaCog />, text: 'Settings' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine the navbar width based on collapsed state
  const navbarWidth = isCollapsed ? 'w-20' : 'w-64';
  
  // Light mode uses blue theme instead of white
  const lightModeClasses = 'bg-blue-600 text-white';
  const darkModeClasses = 'bg-gray-800 text-white';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`fixed top-0 left-0 h-full ${navbarWidth} flex flex-col transition-all duration-300 ${isDarkMode ? darkModeClasses : lightModeClasses} shadow-lg z-50`}>
      <div className={`p-5 border-b border-blue-700 dark:border-gray-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <Link to="/doctordashboard" className="flex items-center no-underline hover:no-underline">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white text-blue-600 dark:bg-blue-800 dark:text-blue-300 font-bold text-xl mr-3 shadow-md">
              <FaLungs className="text-2xl" />
            </div>
            <span className="text-xl font-bold text-white">ChestCare</span>
          </Link>
        )}
        {isCollapsed && (
          <Link to="/doctordashboard" className="no-underline hover:no-underline">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white text-blue-600 dark:bg-blue-800 dark:text-blue-300 font-bold text-xl shadow-md">
              <FaLungs className="text-2xl" />
            </div>
          </Link>
        )}
        {!isCollapsed && (
          <button 
            onClick={toggleCollapse}
            className="text-white hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded-full"
          >
            <FaChevronLeft />
          </button>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center no-underline hover:no-underline ${isCollapsed ? 'justify-center' : 'px-4'} py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.to
                    ? isDarkMode 
                      ? 'bg-gray-700 text-blue-400' 
                      : 'bg-blue-700 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-white hover:bg-blue-700'
                }`}
                title={isCollapsed ? link.text : ""}
              >
                <span className={`text-lg ${isCollapsed ? '' : 'mr-4'}`}>{link.icon}</span>
                {!isCollapsed && <span>{link.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {isCollapsed && (
        <button 
          onClick={toggleCollapse}
          className="mx-auto my-4 text-white hover:bg-blue-700 dark:hover:bg-gray-700 p-2 rounded-full"
        >
          <FaChevronRight />
        </button>
      )}
      
      <div className={`p-4 border-t border-blue-700 dark:border-gray-700 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200
              ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-white hover:bg-blue-700'}`}
          >
            <FaSignOutAlt className="text-lg mr-4" />
            <span>Logout</span>
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 mb-4
              ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-white hover:bg-blue-700'}`}
            title="Logout"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        )}

        <div className={`${isCollapsed ? 'flex justify-center' : 'mt-4 flex justify-center'}`}>
          <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;