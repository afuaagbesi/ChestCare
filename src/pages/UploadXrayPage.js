import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";

const UploadXrayPage = () => {
  const { isDarkMode } = useDarkMode();
  const [currentStep, setCurrentStep] = useState("selectPatient");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatePatientList, setAnimatePatientList] = useState(true);
  
  // Reset animation flag when search query changes
  useEffect(() => {
    setAnimatePatientList(true);
  }, [searchQuery]);
  
  // Mock patient data - in a real app, this would come from your backend
  const patients = [
    { id: "P1001", name: "John Smith", age: 45, gender: "Male" },
    { id: "P1002", name: "Emma Johnson", age: 32, gender: "Female" },
    { id: "P1003", name: "Michael Brown", age: 67, gender: "Male" },
    { id: "P1004", name: "Sarah Williams", age: 28, gender: "Female" },
    { id: "P1005", name: "Robert Davis", age: 52, gender: "Male" }
  ];

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentStep("uploadXray");
    setImage(null);
    setResults(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setError("");
      setResults(null);
    } else {
      setError("Please upload a valid X-ray image file.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!image) {
      setError("Please upload an X-ray image first.");
      return;
    }
    
    setLoading(true);
    setCurrentStep("results");
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock results - in production, these would come from your ML model
      setResults({
        timestamp: new Date().toISOString(),
        patientId: selectedPatient.id,
        predictions: {
          tuberculosis: Math.random() * 0.5, // Random values for demonstration
          cardiomegaly: Math.random() * 0.7,
          pulmonaryHypertension: Math.random() * 0.4,
          pneumonia: Math.random() * 0.6
        }
      });
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setCurrentStep("selectPatient");
    setSelectedPatient(null);
    setImage(null);
    setResults(null);
    setError("");
  };

  const handleDownload = () => {
    if (!results || !selectedPatient) return;
    
    // Create report content
    const reportContent = `
X-Ray Analysis Report
Date: ${new Date(results.timestamp).toLocaleString()}
Patient ID: ${selectedPatient.id}
Patient Name: ${selectedPatient.name}
Age: ${selectedPatient.age}
Gender: ${selectedPatient.gender}

Diagnosis Probabilities:
- Tuberculosis: ${(results.predictions.tuberculosis * 100).toFixed(1)}%
- Cardiomegaly: ${(results.predictions.cardiomegaly * 100).toFixed(1)}%
- Pulmonary Hypertension: ${(results.predictions.pulmonaryHypertension * 100).toFixed(1)}%
- Pneumonia: ${(results.predictions.pneumonia * 100).toFixed(1)}%
    `;
    
    // Create a blob and download link
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xray-report-${selectedPatient.id}.txt`;
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
    if (probability < 0.2) return "bg-green-100 text-green-800";
    if (probability < 0.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
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
      {fullScreen && image && (
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
            <img src={image} alt="X-ray Full Screen" className="max-h-screen max-w-full object-contain" />
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
          
          {/* Reset button (visible after selecting a patient) */}
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
                        {image ? "Image selected" : "No file selected"}
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
                    {image && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4 }}
                        className={`mb-4 border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <div className="relative group">
                          <img 
                            src={image} 
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
                    whileHover={!loading && image ? { scale: 1.02 } : {}}
                    whileTap={!loading && image ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading || !image}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium text-base ${
                      loading || !image ? "bg-blue-400 dark:bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
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
                <div className="mb-4 flex justify-between items-center">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Patient Information</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report
                  </motion.button>
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
                
                {image && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className={`border rounded-md overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="relative group">
                      <img 
                        src={image} 
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
                          // Adjusted color classes for dark mode
                          let colorClass = '';
                          if (isDarkMode) {
                            if (probability < 0.2) colorClass = "bg-green-900/50 text-green-300";
                            else if (probability < 0.5) colorClass = "bg-yellow-900/50 text-yellow-300";
                            else colorClass = "bg-red-900/50 text-red-300";
                          } else {
                            colorClass = getRiskColorClass(probability);
                          }
                          
                          const formattedCondition = condition
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());
                          
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