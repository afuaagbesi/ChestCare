import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientPage from "./pages/PatientPage";
import CreatePatientPage from "./pages/CreatePatientPage";
import UploadXrayPage from "./pages/UploadXrayPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { DarkModeProvider, useDarkMode } from "./contexts/DarkModeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import "./index.css"; // Include Tailwind CSS

// Protected Route Component to check authentication
function PrivateRoute({ element, allowedRoles = [] }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Check if user is authenticated and has appropriate role
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(userRole);
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (!hasRequiredRole) {
    // Redirect to doctor dashboard if authenticated but doesn't have the required role
    return <Navigate to="/doctordashboard" replace />;
  }
  
  // Render the component if authenticated and has required role
  return element;
}

// Separate layouts for public and authenticated pages
function PublicLayout() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </div>
  );
}

function AuthLayout() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, userRole } = useAuth();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Navbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onCollapseChange={(collapsed) => setIsNavbarCollapsed(collapsed)}
        userRole={userRole}
      />
      <main className={`flex-grow ${isNavbarCollapsed ? 'ml-20' : 'ml-64'} bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-all duration-300`}>
        <Routes>
          <Route path="/doctordashboard" element={
            <PrivateRoute element={<DoctorDashboardPage />} allowedRoles={['doctor']} />
          } />
          <Route path="/patients" element={
            <PrivateRoute element={<PatientPage />} allowedRoles={['doctor']} />
          } />
          <Route path="/create-patient" element={
            <PrivateRoute element={<CreatePatientPage />} allowedRoles={['doctor']} />
          } />
          <Route path="/upload-xray" element={
            <PrivateRoute element={<UploadXrayPage />} allowedRoles={['doctor']} />
          } />
          <Route path="/profile" element={
            <PrivateRoute element={<ProfilePage />} allowedRoles={['doctor']} />
          } />
          <Route path="/settings" element={
            <PrivateRoute element={<SettingsPage />} allowedRoles={['doctor']} />
          } />
        </Routes>
      </main>
    </div>
  );
}

// Layout wrapper that decides which layout to show
function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const publicPaths = ['/', '/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.includes(location.pathname);

  return isPublicPath ? <PublicLayout /> : <AuthLayout />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <Layout />
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;