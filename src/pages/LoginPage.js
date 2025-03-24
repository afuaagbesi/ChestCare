import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserMd, FaLock, FaEnvelope } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await authenticateUser(email, password);
      
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  };

  const authenticateUser = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: email === "doctor@hospital.com" && password === "SecurePass123!" });
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50 blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Animated Device Background */}
        <motion.div 
          animate={{ 
            rotate: [0, 2, -2, 0],
            transition: { 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-2xl -z-10"
        />

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaUserMd className="text-6xl text-blue-600" />
              </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              ChestCare
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Secure Professional Login
            </p>

            <form onSubmit={handleLogin}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 relative"
              >
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Professional Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 relative"
              >
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Secure Login
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <Link 
                  to="/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Forgot Password?
                </Link>
              </motion.div>
            </form>
          </div>

          <div className="bg-gray-100 text-center py-4">
            <p className="text-sm text-gray-600">
              ChestCare?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;