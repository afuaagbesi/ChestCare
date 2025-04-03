import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserMd, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "doctor"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create user data object
      const userData = {
        name: 'Doctor User',
        email: formData.email,
        // Add other relevant user data
      };
      
      // Call login from AuthContext
      login(formData.email, 'doctor', userData);
      
      // Success message
      toast.success("Login successful!");
      
      // Redirect to doctor dashboard
      setTimeout(() => {
        navigate('/doctordashboard');
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts when component unmounts
      toast.dismiss();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Login to continue to ChestCare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                  ${error ? 'border-red-500' : 'border-gray-300'} 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                  ${error ? 'border-red-500' : 'border-gray-300'} 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium 
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">New to ChestCare? </span>
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:text-blue-500"
          >
            Create an account
          </Link>
        </div>
      </motion.div>
      <ToastContainer theme="light" />
    </div>
  );
}

export default LoginPage;