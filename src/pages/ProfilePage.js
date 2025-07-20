import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";

function ProfilePage() {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "Dr. John Doe",
    specialty: "Cardiology",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    hospital: "General Medical Center",
    languages: ["English", "Spanish"],
    bio: "Board-certified cardiologist with over 10 years of experience specializing in interventional cardiology and heart failure management.",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/api/placeholder/80/80");
  const [editing, setEditing] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(lang => lang !== language)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavingChanges(true);
    
    // Simulate API call
    setTimeout(() => {
      setSavingChanges(false);
      setEditing(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}
    >
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Success notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center"
              role="alert"
            >
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={`${isDarkMode ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'} rounded-xl overflow-hidden`}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Doctor Profile</h1>
              <motion.button
                onClick={() => setEditing(!editing)}
                className={`text-white px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  editing ? 'bg-gray-700 hover:bg-gray-800' : 'bg-indigo-500 hover:bg-indigo-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {editing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className={`p-8 ${isDarkMode ? 'text-gray-200' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Avatar and basic info */}
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className={`flex flex-col items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg shadow-sm`}>
                  <motion.div 
                    className="relative rounded-full overflow-hidden mb-6 w-40 h-40 border-4 border-blue-100 cursor-pointer shadow-md"
                    onClick={editing ? handleAvatarClick : undefined}
                    whileHover={editing ? { scale: 1.05, borderColor: "#93c5fd" } : {}}
                  >
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    {editing && (
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-white text-sm font-medium">Change Photo</span>
                      </motion.div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </motion.div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{formData.name}</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-black'} font-medium text-lg mb-4`}>{formData.specialty}</p>
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} pt-4 mt-2`}>
                    <div className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-black hover:text-indigo-600'} flex items-center mb-3 transition-colors`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {formData.email}
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-black hover:text-indigo-600'} flex items-center mb-4 transition-colors`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {formData.phone}
                    </div>
                  </div>
                  <div className="w-full">
                    <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3`}>Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {formData.languages.map((language, index) => (
                          <motion.div 
                            key={language}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`${isDarkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} px-3 py-1 rounded-full text-sm flex items-center`}
                          >
                            {language}
                            {editing && (
                              <motion.button 
                                onClick={() => handleRemoveLanguage(language)}
                                className={`ml-2 ${isDarkMode ? 'text-blue-300 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'}`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div 
                className="md:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-lg shadow-sm border`}>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`block w-full rounded-md shadow-sm ${
                            editing 
                              ? isDarkMode 
                                ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                              : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                : 'bg-gray-50 border-gray-200 text-black'
                          } sm:text-sm`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Specialty</label>
                        <input
                          type="text"
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`block w-full rounded-md shadow-sm ${
                            editing 
                              ? isDarkMode 
                                ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                              : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                : 'bg-gray-50 border-gray-200 text-black'
                          } sm:text-sm`}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-md shadow-sm ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                                : isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                  : 'bg-gray-50 border-gray-200 text-black'
                            } sm:text-sm`}
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-md shadow-sm ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                                : isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                  : 'bg-gray-50 border-gray-200 text-black'
                            } sm:text-sm`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Hospital/Practice</label>
                        <input
                          type="text"
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`block w-full rounded-md shadow-sm ${
                            editing 
                              ? isDarkMode 
                                ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                              : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                : 'bg-gray-50 border-gray-200 text-black'
                          } sm:text-sm`}
                        />
                      </div>

                      <AnimatePresence>
                        {editing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Add Language</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md ${
                                  isDarkMode 
                                    ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500' 
                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                } sm:text-sm`}
                                placeholder="e.g. French"
                              />
                              <motion.button
                                type="button"
                                onClick={handleAddLanguage}
                                className={`inline-flex items-center px-4 py-2 border border-l-0 ${
                                  isDarkMode 
                                    ? 'border-gray-600 bg-gray-600 text-gray-200 hover:bg-gray-500' 
                                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                } rounded-r-md sm:text-sm transition-colors`}
                                whileHover={{ backgroundColor: isDarkMode ? "#4B5563" : "#f3f4f6" }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Add
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Bio</label>
                        <textarea
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`block w-full rounded-md shadow-sm ${
                            editing 
                              ? isDarkMode 
                                ? 'border-gray-600 bg-gray-700 text-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all' 
                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all'
                              : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                                : 'bg-gray-50 border-gray-200 text-black'
                          } sm:text-sm`}
                        ></textarea>
                      </div>

                      <AnimatePresence>
                        {editing && (
                          <motion.div 
                            className="flex justify-end"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.button
                              type="submit"
                              disabled={savingChanges}
                              className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                              whileHover={{ scale: 1.03, backgroundColor: "#4f46e5" }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {savingChanges ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving Changes...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Patients",
              value: "1,284",
              icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Diagnosis Count",
              value: "3,426",
              icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              color: "from-green-500 to-green-600"
            },
            {
              title: "Average Response Time",
              value: "2.4 hours",
              icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Accuracy Rate",
              value: "94.3%",
              icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              ),
              color: "from-yellow-500 to-yellow-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} overflow-hidden shadow-lg rounded-xl border`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 bg-gradient-to-r ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                        {stat.title}
                      </dt>
                      <dd className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;