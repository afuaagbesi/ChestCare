import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "../contexts/AuthContext"; 

const UploadXrayPage = () => {
  const { isDarkMode } = useDarkMode();
  const { api } = useAuth();
  const [currentStep, setCurrentStep] = useState("selectPatient");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Store actual file
  const [imagePreview, setImagePreview] = useState(null); // Store preview URL
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatePatientList, setAnimatePatientList] = useState(true);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");
  const [gradcamLoading, setGradcamLoading] = useState(false);
  const [gradcamError, setGradcamError] = useState("");
  const [showGradcam, setShowGradcam] = useState(false);
  const [gradcamImage, setGradcamImage] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setPatientsLoading(true);
        const response = await api.get('/dashboard/api/patients');
        
        const transformedPatients = response.data.map(patient => ({
          id: patient.id.toString(),
          name: patient.full_name,
          age: patient.age,
          gender: patient.gender_display,
          fullData: patient
        }));
        
        setPatients(transformedPatients);
        setPatientsError("");
      } catch (err) {
        console.error('Error fetching patients:', err);
        setPatientsError("Failed to load patients. Please try again.");
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [api]);

  useEffect(() => {
    setAnimatePatientList(true);
  }, [searchQuery]);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentStep("uploadXray");
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
      setResults(null);
    } else {
      setError("Please upload a valid X-ray image file.");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Fixed fetchGradcamImage function with proper authentication
  const fetchGradcamImage = async (predictionId) => {
    try {
      setGradcamLoading(true);
      setGradcamError("");
      
      // Use the authenticated axios instance to fetch as blob
      const response = await api.get(`/api/ml/predictions/${predictionId}/gradcam/`, {
        responseType: 'blob'
      });
      
      // Create object URL from blob
      const gradcamUrl = URL.createObjectURL(response.data);
      setGradcamImage(gradcamUrl);
      setShowGradcam(true);
    } catch (error) {
      console.error('Error loading Grad-CAM:', error);
      if (error.response?.status === 401) {
        setGradcamError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        setGradcamError("Grad-CAM visualization not available for this prediction");
      } else {
        setGradcamError("Failed to load Grad-CAM visualization");
      }
    } finally {
      setGradcamLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (gradcamImage && gradcamImage.startsWith('blob:')) {
        URL.revokeObjectURL(gradcamImage);
      }
    };
  }, [gradcamImage]);

  const regenerateGradcam = async (predictionId) => {
    try {
      setGradcamLoading(true);
      setGradcamError("");
      
      const response = await api.post(`/api/ml/predictions/${predictionId}/regenerate-gradcam/`);
      
      if (response.data.success) {
        // Fetch the new Grad-CAM image
        await fetchGradcamImage(predictionId);
      } else {
        throw new Error(response.data.message || 'Failed to regenerate Grad-CAM');
      }
    } catch (error) {
      console.error('Error regenerating Grad-CAM:', error);
      setGradcamError("Failed to regenerate Grad-CAM visualization");
      setGradcamLoading(false);
    }
  };

  // Fixed handleSubmit function without manual URL construction
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setError("Please upload an X-ray image first.");
      return;
    }
    
    if (!selectedPatient) {
      setError("No patient selected.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('patient_id', selectedPatient.id);
      formData.append('xray_image', imageFile);

      // Make API call to backend
      const response = await api.post('/api/ml/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Transform backend response to match frontend expectations
        const backendData = response.data.data;
        const transformedResults = {
          timestamp: backendData.created_at,
          patientId: selectedPatient.id,
          predictionId: backendData.id,
          predictions: backendData.all_predictions || {},
          predictedDisease: backendData.predicted_disease,
          confidenceScore: backendData.confidence_score,
          xrayImageUrl: backendData.xray_image,
          gradcamAvailable: response.data.gradcam_available || !!backendData.gradcam_image
        };

        setResults(transformedResults);
        
        // Don't manually construct URL - let fetchGradcamImage handle it
        if (response.data.gradcam_available && backendData.id) {
          // Automatically fetch Grad-CAM after successful prediction
          await fetchGradcamImage(backendData.id);
        }
        
        setCurrentStep("results");
      } else {
        throw new Error(response.data.message || 'Prediction failed');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      let errorMessage = 'An error occurred during prediction.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch Grad-CAM for different diseases
  const fetchGradcamForDisease = async (predictionId, diseaseType) => {
    try {
      setGradcamLoading(true);
      setGradcamError("");
      
      // If you want to generate Grad-CAM for a specific disease
      const response = await api.get(`/api/ml/predictions/${predictionId}/gradcam/?disease=${diseaseType}`, {
        responseType: 'blob'
      });
      
      const gradcamUrl = URL.createObjectURL(response.data);
      setGradcamImage(gradcamUrl);
      setShowGradcam(true);
    } catch (error) {
      console.error('Error loading Grad-CAM:', error);
      setGradcamError(`Failed to load Grad-CAM for ${diseaseType}`);
    } finally {
      setGradcamLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep("selectPatient");
    setSelectedPatient(null);
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setError("");
    setGradcamImage(null);
    setGradcamError("");
    setShowGradcam(false);
    setGradcamLoading(false);
  };

  const handleDownload = () => {
    if (!results || !selectedPatient) return;
    
    // Create report content using real backend data
    const reportContent = `
X-Ray Analysis Report
Date: ${new Date(results.timestamp).toLocaleString()}
Patient ID: ${selectedPatient.id}
Patient Name: ${selectedPatient.name}
Age: ${selectedPatient.age}
Gender: ${selectedPatient.gender}

Primary Diagnosis: ${results.predictedDisease}
Confidence Score: ${(results.confidenceScore * 100).toFixed(1)}%

Detailed Probabilities:
${Object.entries(results.predictions || {})
  .map(([disease, prob]) => `- ${disease.charAt(0).toUpperCase() + disease.slice(1)}: ${(prob * 100).toFixed(1)}%`)
  .join('\n')}

Note: This AI analysis is meant to assist medical professionals and should not replace clinical judgment.
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xray-report-${selectedPatient.id}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate risk level based on probability
  const getRiskLevel = (probability) => {
    if (probability < 0.2) return "Low";
    if (probability < 0.5) return "Moderate";
    return "High";
  };

  // Get color class based on probability
  const getRiskColorClass = (probability) => {
    if (isDarkMode) {
      if (probability < 0.2) return "bg-green-900/50 text-green-300";
      if (probability < 0.5) return "bg-yellow-900/50 text-yellow-300";
      return "bg-red-900/50 text-red-300";
    } else {
      if (probability < 0.2) return "bg-green-100 text-green-800";
      if (probability < 0.5) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (percent) => ({
      width: `${percent}%`,
      transition: { 
        duration: 0.8, 
        ease: "easeOut"
      }
    })
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {fullScreen && imagePreview && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center" 
          onClick={() => setFullScreen(false)}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-full max-h-full p-2"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200"
              onClick={() => setFullScreen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
            <img src={imagePreview} alt="X-ray Full Screen" className="max-h-screen max-w-full object-contain" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Enhanced Grad-CAM Modal */}
      {showGradcam && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" 
          onClick={() => setShowGradcam(false)}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-6xl max-h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Grad-CAM Visualization
                </h3>
                {/* Disease selector if you have multiple models */}
                {results?.predictions && Object.keys(results.predictions).length > 1 && (
                  <select 
                    value={results.predictedDisease} 
                    onChange={(e) => {
                      fetchGradcamForDisease(results.predictionId, e.target.value);
                    }}
                    className="mt-2 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  >
                    {Object.keys(results.predictions).map(disease => (
                      <option key={disease} value={disease}>
                        {disease.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => setShowGradcam(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
            </div>
            
            <div className="p-4">
              {gradcamLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : gradcamError ? (
                <div className="text-center p-8 text-red-600">
                  <p>{gradcamError}</p>
                  <button 
                    onClick={() => fetchGradcamImage(results?.predictionId)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original X-ray</h4>
                    <img src={imagePreview} alt="Original X-ray" className="w-full h-auto rounded border" />
                  </div>
                  <div>

                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grad-CAM Heatmap - {(results?.currentViewedDisease || results?.predictedDisease)?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    {gradcamImage ? (
                      <img src={gradcamImage} alt="Grad-CAM Visualization" className="w-full h-auto rounded border" />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center">
                        <p className="text-gray-500">No Grad-CAM available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">What is Grad-CAM?</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Grad-CAM (Gradient-weighted Class Activation Mapping) highlights the regions of the X-ray 
                  that most influenced the AI's decision for {results?.predictedDisease?.replace(/_/g, ' ')}. 
                  Red/warm areas indicate high attention, while blue/cool areas indicate low attention.
                </p>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => regenerateGradcam(results?.predictionId)}
                  disabled={gradcamLoading}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {gradcamLoading ? 'Regenerating...' : 'Regenerate'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGradcam(false)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
          >
            X-Ray Diagnostic System
          </motion.h1>
          
          {/* Stepper */}
          <div className="hidden md:flex items-center space-x-2">
            {["selectPatient", "uploadXray", "results"].map((step, index) => {
              const stepLabels = ["Select Patient", "Upload X-ray", "View Results"];
              const isActive = currentStep === step;
              
              return (
                <React.Fragment key={step}>
                  {index > 0 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "2rem" }}
                      className={`h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    ></motion.div>
                  )}
                  <div className={`flex items-center ${isActive ? "text-blue-600" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <motion.div 
                      animate={{
                        backgroundColor: isActive 
                          ? "#2563EB" 
                          : isDarkMode ? "#374151" : "#E5E7EB",
                        color: isActive 
                          ? "white" 
                          : isDarkMode ? "#D1D5DB" : "#6B7280"
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center`}
                    >
                      {index + 1}
                    </motion.div>
                    <span className="ml-2">{stepLabels[index]}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          
          {/* Reset button */}
          <AnimatePresence>
            {selectedPatient && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Patient selection step */}
        <AnimatePresence mode="wait">
          {currentStep === "selectPatient" && (
            <motion.div
              key="select-patient"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-lg shadow-md p-6`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-2 md:space-y-0">
                <motion.h2 
                  variants={itemVariants}
                  className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
                >
                  Select Patient
                </motion.h2>
                
                {/* Search Bar */}
                <motion.div 
                  variants={itemVariants}
                  className="relative w-full md:w-64"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                    type="text"
                    placeholder="Search patients by name or ID..."
                    className={`pl-10 pr-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400' : 'border-gray-300 bg-white text-gray-700'} rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </motion.div>
              </div>
              
              {patientsLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : patientsError ? (
                <div className="py-12 text-center text-red-600">
                  {patientsError}
                </div>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className={`border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>ID</th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Age</th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Gender</th>
                        <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      <AnimatePresence>
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient, index) => (
                            <motion.tr 
                              key={patient.id}
                              custom={index}
                              variants={tableRowVariants}
                              initial={animatePatientList ? "hidden" : "visible"}
                              animate="visible"
                              className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                            >
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{patient.id}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{patient.name}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{patient.age}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{patient.gender}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSelectPatient(patient)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Select
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <td colSpan="5" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No patients found matching "{searchQuery}"
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>
              )}
            </motion.div>
          )}
          
          {/* Upload X-ray step */}
          {currentStep === "uploadXray" && selectedPatient && (
            <motion.div
              key="upload-xray"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <motion.div 
                variants={itemVariants}
                className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Patient Information</h2>
                <div className="space-y-3">
                  {[
                    { label: "Patient ID:", value: selectedPatient.id },
                    { label: "Name:", value: selectedPatient.name },
                    { label: "Age:", value: selectedPatient.age },
                    { label: "Gender:", value: selectedPatient.gender }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`flex justify-between border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Upload X-ray for {selectedPatient.name}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Select X-ray Image
                    </label>
                    <div className="flex items-center">
                      <motion.label 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer ${isDarkMode ? 'bg-blue-900 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-600 border-blue-300'} px-4 py-2 border rounded-l-md ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-100'} focus:outline-none`}
                      >
                        <span>Browse Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </motion.label>
                      <div className={`flex-grow px-3 py-2 border border-l-0 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-600'} rounded-r-md text-sm truncate`}>
                        {imageFile ? imageFile.name : "No file selected"}
                      </div>
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 text-sm text-red-600 dark:text-red-400"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className={`mb-4 border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <div className="relative group">
                          <img 
                            src={imagePreview} 
                            alt="X-ray Preview" 
                            className="w-full h-auto cursor-pointer" 
                            onClick={() => setFullScreen(true)}
                          />
                          <motion.div 
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                          >
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button" 
                              className="bg-white rounded-full p-2 shadow-lg"
                              onClick={() => setFullScreen(true)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                              </svg>
                            </motion.button>
                          </motion.div>
                        </div>
                        <div className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} py-2 px-3 text-sm text-center`}>
                          Click to view full screen
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.button
                    whileHover={!loading && imageFile ? { scale: 1.02 } : {}}
                    whileTap={!loading && imageFile ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading || !imageFile}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium text-base ${
                      loading || !imageFile ? "bg-blue-400 dark:bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : "Analyze X-ray"}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
          
          {/* Results step */}
          {currentStep === "results" && selectedPatient && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <motion.div 
                variants={itemVariants}
                className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
              >
                <div className="mb-4 flex justify-between items-start space-x-2">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Patient Information</h2>
                  <div className="flex flex-col space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (gradcamImage) {
                          setShowGradcam(true);
                        } else if (results?.predictionId) {
                          fetchGradcamImage(results.predictionId);
                        }
                      }}
                      disabled={gradcamLoading}
                      className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white ${
                        gradcamLoading 
                          ? 'bg-purple-400 cursor-not-allowed' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                    >
                      {gradcamLoading ? (
                        <>
                          <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          AI Focus
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Patient ID:", value: selectedPatient.id },
                    { label: "Name:", value: selectedPatient.name },
                    { label: "Age:", value: selectedPatient.age },
                    { label: "Gender:", value: selectedPatient.gender },
                    ...(results ? [{ label: "Analysis Date:", value: new Date(results.timestamp).toLocaleString() }] : [])
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`flex justify-between border-b pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
                
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className={`border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="X-ray" 
                        className="w-full h-auto cursor-pointer" 
                        onClick={() => setFullScreen(true)}
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                      >
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button" 
                          className="bg-white rounded-full p-2 shadow-lg"
                          onClick={() => setFullScreen(true)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </motion.button>
                      </motion.div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} py-2 px-3 text-sm text-center`}>
                      Click to view full screen
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
              >
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Analysis Results</h2>
                  
                <AnimatePresence>
                  {gradcamError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md"
                    >
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {gradcamError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 flex flex-col items-center"
                  >
                    <svg className={`animate-spin mb-4 h-10 w-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Analyzing X-ray image...</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>This may take a few moments</p>
                  </motion.div>
                ) : results ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Diagnosis Probabilities</h3>
                      <div className="space-y-4">
                        {Object.entries(results.predictions).map(([condition, probability], index) => {
                          const percent = probability * 100;
                          const riskLevel = getRiskLevel(probability);
                          const colorClass = getRiskColorClass(probability);
                          
                          const formattedCondition = condition
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                            .replace(/_/g, ' ');
                          
                          return (
                            <motion.div 
                              key={condition}
                              initial="hidden"
                              animate="visible"
                              custom={index}
                              transition={{ delay: index * 0.2 }}
                              className={`border rounded-md p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{formattedCondition}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                  {riskLevel} Risk
                                </span>
                              </div>
                              <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <span className={`text-xs font-semibold inline-block ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                      Probability
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-xs font-semibold inline-block ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                      {percent.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className={`overflow-hidden h-2 text-xs flex rounded ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-200'}`}>
                                  <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    custom={percent}
                                    variants={progressVariants}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}
                                  ></motion.div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className={`${isDarkMode ? 'bg-blue-900/20 border-blue-800/50 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'} p-4 rounded-md border`}
                    >
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>Primary Diagnosis</h3>
                      <p className="mb-2">
                        <span className="font-medium">Disease:</span> {results.predictedDisease?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="mb-4">
                        <span className="font-medium">Confidence:</span> {(results.confidenceScore * 100).toFixed(1)}%
                      </p>
                      
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>Recommendations</h3>
                      <p>
                        Based on the analysis, this patient should be evaluated by a specialist 
                        for further diagnosis and treatment planning. The X-ray shows potential 
                        indicators that require professional review.
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-2 italic`}>
                        Note: This AI analysis is meant to assist medical professionals and should not 
                        replace clinical judgment.
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`py-12 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Please upload an X-ray image for analysis
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UploadXrayPage;