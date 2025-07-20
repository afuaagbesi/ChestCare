import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useDarkMode } from "../contexts/DarkModeContext";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default function AuthLayout() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <RequireAuth>
      <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onCollapseChange={setIsCollapsed}
        />
        <main
          className={`flex-grow ${
            isCollapsed ? "ml-20" : "ml-64"
          } bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-all duration-300`}
        >
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
}
