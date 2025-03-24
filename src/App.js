import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PatientPage from "./pages/PatientPage";
import CreatePatientPage from "./pages/CreatePatientPage";
import UploadXrayPage from "./pages/UploadXrayPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import "./index.css"; // Include Tailwind CSS

// Layout component that conditionally renders the Navbar
function AppLayout({ toggleDarkMode, isDarkMode }) {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/register'];
  const shouldShowNavbar = !publicRoutes.includes(location.pathname);
  
  return (
    <div className={`App flex ${isDarkMode ? 'dark' : ''}`}>
      {shouldShowNavbar && (
        <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      )}
      
      {/* Main Content Area with conditional margin */}
      <main className={`flex-grow ${shouldShowNavbar ? 'ml-64' : ''} bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text min-h-screen transition-colors duration-300`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Doctor Routes */}
          <Route path="/doctordashboard" element={<DoctorDashboardPage />} />
          <Route path="/patients" element={<PatientPage />} />
          <Route path="/create-patient" element={<CreatePatientPage />} />
          <Route path="/upload-xray" element={<UploadXrayPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Routes */}
          <Route path="/admindashboard" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  // Check localStorage and system preference on initial load
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // First check localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // If not set, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Add listener with compatibility check
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <AppLayout toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
    </Router>
  );
}

export default App;