import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call for password reset
      setTimeout(() => {
        // In a real app, this would call an API to send a reset email
        setIsSubmitted(true);
        toast.success("Password reset instructions sent to your email!");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred. Please try again.");
      toast.error("Failed to send password reset link.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {!isSubmitted 
              ? "Enter your email address and we'll send you instructions to reset your password." 
              : "Check your email for a link to reset your password."}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    error ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center mt-8">
            <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-6">
              Password reset link has been sent to <strong>{email}</strong>
            </div>
            <p className="text-gray-600 mb-4">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                toast.info("Reset link will be sent again");
              }}
              className="text-white-600 hover:text-white-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage; 