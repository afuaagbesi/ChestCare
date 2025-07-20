import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";

import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";

// Page imports
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientPage from "./pages/PatientPage";
import CreatePatientPage from "./pages/CreatePatientPage";
import UploadXrayPage from "./pages/UploadXrayPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <Routes>

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Protected routes */}
            <Route element={<AuthLayout />}>
              <Route index element={<Navigate to="doctordashboard" replace />} />
              <Route path="doctordashboard" element={<DoctorDashboardPage />} />
              <Route path="patients" element={<PatientPage />} />
              <Route path="create-patient" element={<CreatePatientPage />} />
              <Route path="upload-xray" element={<UploadXrayPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="doctordashboard" replace />} />
            </Route>

          </Routes>
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
