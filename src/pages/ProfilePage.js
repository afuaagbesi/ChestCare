import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useDoctorProfile } from "../hooks/useDoctorProfile";

// Skeleton loader components for better loading UX
const SkeletonLoader = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded ${className}`} />
);

const StatCardSkeleton = ({ isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} overflow-hidden shadow-lg rounded-xl border p-6`}>
    <div className="flex items-center">
      <SkeletonLoader className="w-12 h-12 rounded-md" />
      <div className="ml-5 flex-1">
        <SkeletonLoader className="h-4 w-20 mb-2" />
        <SkeletonLoader className="h-6 w-16" />
      </div>
    </div>
  </div>
);

const ProfileFormSkeleton = ({ isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-lg shadow-sm border`}>
    <div className="space-y-5">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <SkeletonLoader className="h-4 w-24 mb-2" />
          <SkeletonLoader className="h-10 w-full" />
        </div>
      ))}
      <div>
        <SkeletonLoader className="h-4 w-16 mb-2" />
        <SkeletonLoader className="h-24 w-full" />
      </div>
    </div>
  </div>
);

function ProfilePage() {
  const { isDarkMode } = useDarkMode();
  const { profile, stats, loading, error, updateProfile, uploadAvatar } = useDoctorProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    hospital: "",
    languages: [],
    bio: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/api/placeholder/80/80");
  const [editing, setEditing] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  // Memoized stats cards for better performance
  const statsCards = useMemo(() => [
    {
      title: "Total Patients",
      value: stats?.total_patients || "0",
      icon: (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Diagnosis Count",
      value: stats?.total_diagnoses || "0",
      icon: (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-green-500 to-green-600",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Today's Appointments",
      value: stats?.todays_appointments || "0",
      icon: (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      change: "0",
      trend: "neutral"
    },
    {
      title: "Accuracy Rate",
      value: stats?.accuracy_rate || "N/A",
      icon: (
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      color: "from-yellow-500 to-yellow-600",
      change: "+2%",
      trend: "up"
    }
  ], [stats]);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name || `Dr. ${profile.user_details?.first_name || ''} ${profile.user_details?.last_name || ''}`,
        specialty: profile.specialty || "",
        email: profile.email || profile.user_details?.email || "",
        phone: profile.phone || profile.user_details?.phone_number || "",
        hospital: profile.hospital || "",
        languages: profile.languages || [],
        bio: profile.bio || "",
      });
      setAvatarPreview(profile.avatar_url || "/api/placeholder/80/80");
    }
  }, [profile]);

  useEffect(() => {
    if (showSuccess || errorMessage) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (editing && !uploadingAvatar) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Enhanced file validation
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (JPG, PNG, GIF)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB');
        return;
      }

      try {
        setUploadingAvatar(true);
        setSelectedAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
        await uploadAvatar(file);
        setShowSuccess(true);
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        setAvatarPreview(profile?.avatar_url || "/api/placeholder/80/80");
        setErrorMessage('Failed to upload avatar. Please try again.');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingChanges(true);
    
    try {
      const nameParts = formData.name.replace(/^Dr\.\s*/, "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const updateData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone_number: formData.phone,
        specialty: formData.specialty,
        hospital: formData.hospital,
        bio: formData.bio,
        languages: formData.languages,
      };

      await updateProfile(updateData);
      setEditing(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  // Show loading state with skeleton
  if (loading) {
    return (
      <motion.div 
        className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className={`${isDarkMode ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'} rounded-xl overflow-hidden mb-8`}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <SkeletonLoader className="h-8 w-48 bg-blue-500" />
                <SkeletonLoader className="h-10 w-24 bg-blue-500" />
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Avatar skeleton */}
                <div className="md:col-span-1">
                  <div className={`flex flex-col items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg`}>
                    <SkeletonLoader className="w-40 h-40 rounded-full mb-6" />
                    <SkeletonLoader className="h-8 w-32 mb-2" />
                    <SkeletonLoader className="h-6 w-24 mb-4" />
                    <SkeletonLoader className="h-4 w-full mb-2" />
                    <SkeletonLoader className="h-4 w-full" />
                  </div>
                </div>
                {/* Form skeleton */}
                <div className="md:col-span-3">
                  <ProfileFormSkeleton isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div 
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-8 rounded-xl shadow-xl border max-w-md mx-4`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Error Loading Profile
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
              {error}
            </p>
            <motion.button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}
    >
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Enhanced notifications */}
        <AnimatePresence>
          {(showSuccess || errorMessage) && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ${
                showSuccess 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              } border px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm flex items-center max-w-md`}
            >
              <div className={`flex-shrink-0 ${showSuccess ? 'text-green-400' : 'text-red-400'} mr-3`}>
                {showSuccess ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {showSuccess ? 'Profile updated successfully!' : errorMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={`${isDarkMode ? 'bg-gray-800/50 shadow-2xl backdrop-blur-xl' : 'bg-white/80 shadow-xl backdrop-blur-xl'} rounded-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700/50' : 'border-white/50'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Header */}
          <div className="bg-blue-600 px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Doctor Profile</h1>
                <p className="text-blue-100 opacity-90">Manage your professional information</p>
              </div>
              <motion.button
                onClick={() => setEditing(!editing)}
                className={`text-white px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  editing 
                    ? 'bg-white/20 hover:bg-white/30 border border-white/30' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editing ? "M6 18L18 6M6 6l12 12" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
                  </svg>
                  {editing ? "Cancel" : "Edit Profile"}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className={`p-8 ${isDarkMode ? 'text-gray-200' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Enhanced Avatar section */}
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={`relative ${isDarkMode ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-6 rounded-2xl backdrop-blur-sm border ${isDarkMode ? 'border-gray-600/30' : 'border-gray-200/50'}`}>
                  <motion.div 
                    className="relative rounded-2xl overflow-hidden mb-6 w-40 h-40 mx-auto border-4 border-gradient-to-r from-blue-400 to-purple-500 cursor-pointer group"
                    onClick={handleAvatarClick}
                    whileHover={editing ? { scale: 1.05 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                    {editing && !uploadingAvatar && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="text-white text-sm font-medium flex items-center">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Change Photo
                        </div>
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
                  
                  <div className="text-center mb-6">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {formData.name || 'Loading...'}
                    </h2>
                    <p className={`${isDarkMode ? 'text-blue-400' : 'text-indigo-600'} font-semibold text-lg`}>
                      {formData.specialty || 'Loading...'}
                    </p>
                  </div>
                  
                  <div className={`border-t ${isDarkMode ? 'border-gray-600/50' : 'border-gray-200'} pt-6 space-y-4`}>
                    <div className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-indigo-600'} flex items-center transition-colors group`}>
                      <div className="p-2 rounded-lg bg-blue-600 mr-3 group-hover:shadow-lg transition-shadow flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium truncate">{formData.email || 'Loading...'}</span>
                    </div>
                    
                    <div className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-indigo-600'} flex items-center transition-colors group`}>
                      <div className="p-2 rounded-lg bg-green-600 mr-3 group-hover:shadow-lg transition-shadow flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{formData.phone || 'Loading...'}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Languages section */}
                  <div className="mt-6">
                    <h3 className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-semibold mb-3 flex items-center`}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {formData.languages.map((language) => (
                          <motion.div 
                            key={language}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`${isDarkMode ? 'bg-blue-800 text-blue-100 border-blue-700/50' : 'bg-blue-50 text-blue-800 border-blue-200'} px-3 py-2 rounded-full text-xs font-medium flex items-center border`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {language}
                            {editing && (
                              <motion.button 
                                onClick={() => handleRemoveLanguage(language)}
                                className={`ml-2 ${isDarkMode ? 'text-blue-300 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'} hover:bg-white/20 rounded-full p-0.5 transition-colors`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
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

              {/* Enhanced Form */}
              <motion.div 
                className="md:col-span-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700/30 to-gray-800/30 border-gray-600/30' : 'bg-gradient-to-br from-white/80 to-gray-50/80 border-gray-200/50'} p-8 rounded-2xl backdrop-blur-sm border`}>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Name Input */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-xl transition-all duration-200 ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                : isDarkMode
                                  ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                            } px-4 py-3 text-sm backdrop-blur-sm`}
                            placeholder="Enter your full name"
                          />
                          {editing && (
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Specialty Input */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Medical Specialty
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-xl transition-all duration-200 ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                : isDarkMode
                                  ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                            } px-4 py-3 text-sm backdrop-blur-sm`}
                            placeholder="e.g. Cardiology, Neurology"
                          />
                          {editing && (
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Email and Phone Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={!editing}
                              className={`block w-full rounded-xl transition-all duration-200 ${
                                editing 
                                  ? isDarkMode 
                                    ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                    : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                  : isDarkMode
                                    ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                              } px-4 py-3 text-sm backdrop-blur-sm`}
                              placeholder="your.email@example.com"
                            />
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                        >
                          <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={!editing}
                              className={`block w-full rounded-xl transition-all duration-200 ${
                                editing 
                                  ? isDarkMode 
                                    ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                    : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                  : isDarkMode
                                    ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                    : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                              } px-4 py-3 text-sm backdrop-blur-sm`}
                              placeholder="+1 (555) 123-4567"
                            />
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Hospital Input */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Hospital/Practice
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-xl transition-all duration-200 ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                : isDarkMode
                                  ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                            } px-4 py-3 text-sm backdrop-blur-sm`}
                            placeholder="Hospital or clinic name"
                          />
                          {editing && (
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Add Language Input */}
                      <AnimatePresence>
                        {editing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                              Add Language
                            </label>
                            <div className="flex rounded-xl shadow-sm overflow-hidden">
                              <input
                                type="text"
                                value={newLanguage}
                                onChange={(e) => setNewLanguage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                                className={`flex-1 min-w-0 block w-full px-4 py-3 ${
                                  isDarkMode 
                                    ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30' 
                                    : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30'
                                } text-sm focus:ring-2 backdrop-blur-sm`}
                                placeholder="e.g. Spanish, French, German"
                              />
                              <motion.button
                                type="button"
                                onClick={handleAddLanguage}
                                className={`inline-flex items-center px-6 py-3 ${
                                  isDarkMode 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                } text-sm font-medium transition-all`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Bio Textarea */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Professional Bio
                        </label>
                        <div className="relative">
                          <textarea
                            name="bio"
                            rows="5"
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!editing}
                            className={`block w-full rounded-xl transition-all duration-200 resize-none ${
                              editing 
                                ? isDarkMode 
                                  ? 'border-gray-500 bg-gray-700/50 text-gray-200 focus:border-blue-500 focus:ring-blue-500/30 focus:ring-2 shadow-lg' 
                                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500/30 focus:ring-2 shadow-lg hover:border-gray-400'
                                : isDarkMode
                                  ? 'bg-gray-800/50 border-gray-600/50 text-gray-300 cursor-not-allowed' 
                                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                            } px-4 py-3 text-sm backdrop-blur-sm`}
                            placeholder="Share your experience, achievements, and areas of expertise..."
                          />
                          {editing && (
                            <div className="absolute right-3 top-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.bio.length}/500 characters
                        </p>
                      </motion.div>

                      {/* Save Button */}
                      <AnimatePresence>
                        {editing && (
                          <motion.div 
                            className="flex justify-end pt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.button
                              type="submit"
                              disabled={savingChanges}
                              className="inline-flex items-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={!savingChanges ? { 
                                scale: 1.05, 
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                              } : {}}
                              whileTap={!savingChanges ? { scale: 0.95 } : {}}
                            >
                              {savingChanges ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                                  Saving Changes...
                                </>
                              ) : (
                                <>
                                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Save Changes
                                </>
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

        {/* Enhanced Stats Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white/80 border-gray-200/50'} overflow-hidden shadow-xl rounded-2xl border backdrop-blur-xl`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`flex-shrink-0 rounded-xl p-3 bg-gradient-to-r ${stat.color} shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                          {stat.title}
                        </dt>
                        <dd className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} flex items-baseline`}>
                          {stat.value}
                          {stat.change !== "0" && (
                            <span className={`ml-2 text-xs font-medium flex items-center ${
                              stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              {stat.trend === 'up' && (
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                                </svg>
                              )}
                              {stat.change}
                            </span>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-6 py-3 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50/80'} backdrop-blur-sm`}>
                <div className="text-xs">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title === "Total Patients" && "Lifetime patients treated"}
                    {stat.title === "Diagnosis Count" && "Total diagnoses made"}
                    {stat.title === "Today's Appointments" && "Scheduled for today"}
                    {stat.title === "Accuracy Rate" && "Diagnostic accuracy"}
                  </span>
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