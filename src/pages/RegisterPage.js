// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaUserMd, FaEnvelope, FaPhone, FaHospital, FaGlobe } from "react-icons/fa";

// function RegisterPage() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     hospital: "",
//     medicalLicense: "",
//     country: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch("https://restcountries.com/v3.1/all");
//         const data = await response.json();
//         const sortedCountries = data
//           .map((country) => country.name.common)
//           .sort((a, b) => a.localeCompare(b));
//         setCountries(sortedCountries);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//         setLoading(false);
//       }
//     };

//     fetchCountries();
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Please enter a valid professional email.";
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(formData.password)) {
//       newErrors.password = "Password must be 8+ characters, include uppercase, lowercase, number, and special character.";
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match.";
//     }

//     const requiredFields = ['firstName', 'lastName', 'email', 'hospital', 'country', 'password', 'confirmPassword'];
//     requiredFields.forEach(field => {
//       if (!formData[field]) {
//         newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       try {
//         const response = await registerUser(formData);
        
//         if (response.success) {
//           navigate("/login");
//         } else {
//           setErrors({ submit: response.message || "Registration failed." });
//         }
//       } catch (error) {
//         console.error("Registration error:", error);
//         setErrors({ submit: "An error occurred during registration." });
//       }
//     }
//   };

//   const registerUser = async (data) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ 
//           success: true, 
//           message: "Registration successful. Please log in." 
//         });
//       }, 1500);
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50 blur-3xl -z-10" />
      
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-lg relative"
//       >
//         {/* Animated Device Background */}
//         <motion.div 
//           animate={{ 
//             rotate: [0, 2, -2, 0],
//             transition: { 
//               duration: 5, 
//               repeat: Infinity,
//               ease: "easeInOut"
//             }
//           }}
//           className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-2xl -z-10"
//         />

//         <div className="bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10 p-8">
//           <div className="flex justify-center mb-6">
//             <motion.div
//               initial={{ scale: 0.5, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <FaUserMd className="text-6xl text-blue-600" />
//             </motion.div>
//           </div>

//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
//             ChestCare
//           </h2>
//           <p className="text-center text-gray-600 mb-6">
//             Create Your Professional Account
//           </p>

//           <form onSubmit={handleSubmit}>
//             {errors.submit && (
//               <motion.div 
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-center"
//               >
//                 {errors.submit}
//               </motion.div>
//             )}

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <motion.div 
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 <input
//                   type="text"
//                   name="firstName"
//                   placeholder="First Name"
//                   className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                   value={formData.firstName}
//                   onChange={handleChange}
//                 />
//                 {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//               </motion.div>
//               <motion.div 
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <input
//                   type="text"
//                   name="lastName"
//                   placeholder="Last Name"
//                   className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                   value={formData.lastName}
//                   onChange={handleChange}
//                 />
//                 {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
//               </motion.div>
//             </div>

//             <motion.div 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="mb-4 relative"
//             >
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Professional Email"
//                 className={`w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//             </motion.div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <motion.div 
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="relative"
//               >
//                 <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                 <input
//                   type="tel"
//                   name="phoneNumber"
//                   placeholder="Phone Number"
//                   className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                 />
//               </motion.div>
//               <motion.div 
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.5 }}
//                 className="relative"
//               >
//                 <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                 <select
//                   name="country"
//                   className={`w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                   value={formData.country}
//                   onChange={handleChange}
//                   disabled={loading}
//                 >
//                   <option value="">Select Country</option>
//                   {countries.map((country, index) => (
//                     <option key={index} value={country} className="bg-white">{country}</option>
//                   ))}
//                 </select>
//                 {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
//               </motion.div>
//             </div>

//             <motion.div 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.6 }}
//               className="mb-4"
//             >
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Create Password"
//                 className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.7 }}
//               className="mb-6"
//             >
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//               {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
//             </motion.div>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
//             >
//               Create Account
//             </motion.button>
//           </form>

//           <div className="mt-6 text-center text-gray-600">
//             <p>
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
//                 Log In
//               </Link>
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default RegisterPage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed

import { motion } from "framer-motion";
import { FaUserMd, FaEnvelope, FaPhone, FaHospital, FaGlobe } from "react-icons/fa";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hospital: "",
    medicalLicense: "",
    country: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      } catch (err) {
        console.error("Error fetching countries:", err);
        // Add error to the errors state object instead of using setError
        setErrors(prev => ({ ...prev, countryFetch: err.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid professional email.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'country', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        const fieldName = field === 'confirmPassword' ? 'Confirm Password' : 
                         field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
        newErrors[field] = `${fieldName} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (validateForm()) {
      try {
        await register(formData);
        
        // Registration successful - redirect to dashboard or home
      navigate("/doctordashboard", { replace: true });
        
      } catch (error) {
        console.error("Registration error:", error);
        
        // Handle different types of errors
        if (error.response && error.response.data) {
          const backendErrors = error.response.data;
          const formattedErrors = {};
          
          // Handle field-specific errors
          Object.keys(backendErrors).forEach(key => {
            if (Array.isArray(backendErrors[key])) {
              formattedErrors[key] = backendErrors[key][0]; // Take first error message
            } else {
              formattedErrors[key] = backendErrors[key];
            }
          });
          
          // Handle common field mappings
          if (formattedErrors.first_name) {
            formattedErrors.firstName = formattedErrors.first_name;
            delete formattedErrors.first_name;
          }
          if (formattedErrors.last_name) {
            formattedErrors.lastName = formattedErrors.last_name;
            delete formattedErrors.last_name;
          }
          if (formattedErrors.phone_number) {
            formattedErrors.phoneNumber = formattedErrors.phone_number;
            delete formattedErrors.phone_number;
          }
          if (formattedErrors.confirm_password) {
            formattedErrors.confirmPassword = formattedErrors.confirm_password;
            delete formattedErrors.confirm_password;
          }
          
          setErrors(formattedErrors);
          
          // If no specific field errors, show general error
          if (Object.keys(formattedErrors).length === 0) {
            setErrors({ submit: "Registration failed. Please try again." });
          }
        } else {
          setErrors({ submit: "Network error. Please check your connection and try again." });
        }
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-50 blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative"
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

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden relative z-10 p-8">
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
            Create Your Professional Account
          </p>

          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 text-center"
              >
                {errors.submit}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 relative"
            >
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Professional Email"
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  name="country"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-800 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                  value={formData.country}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country} className="bg-white">{country}</option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-4"
            >
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 bg-gray-50 text-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </motion.div>

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;