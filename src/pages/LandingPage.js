import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";
import { FaMoon, FaSun } from "react-icons/fa";

function LandingPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const diseases = [
    {
      id: 'pneumonia',
      title: "Pneumonia Detection",
      description: "Our system supports the detection of pneumonia indicators in chest X-rays, helping healthcare professionals make informed decisions for better treatment outcomes.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMAYYmcQjrkQ_5FSKaBhKbMJqiJ9E5vo8NNg&s",
      color: "blue",
      stats: [
        { value: "98%", label: "Detection Accuracy" },
        { value: "3 min", label: "Average Analysis Time" },
        { value: "24/7", label: "Availability" }
      ],
      benefits: [
        "Rapid Analysis Support",
        "High-Resolution Visualization",
        "Structured Reporting",
        "Integration with Hospital Systems"
      ]
    },
    {
      id: 'tuberculosis',
      title: "Tuberculosis Screening",
      description: "Supporting early detection of tuberculosis markers. Our system assists healthcare professionals in identifying TB indicators with high precision.",
      image: "https://www.healthimages.com/content/uploads/sites/2/2022/11/xray.jpg.webp",
      color: "green",
      stats: [
        { value: "95%", label: "Detection Accuracy" },
        { value: "5 min", label: "Average Analysis Time" },
        { value: "Global", label: "Database Reference" }
      ],
      benefits: [
        "High-Resolution Analysis",
        "Detailed Report Generation",
        "Early-Stage Detection",
        "Rural Healthcare Support"
      ]
    },
    {
      id: 'cardiomegaly',
      title: "Cardiomegaly Analysis",
      description: "Supporting the assessment of heart enlargement through comprehensive measurements and pattern recognition, aiding in the detection of cardiac abnormalities.",
      image: "https://www.researchgate.net/publication/368350236/figure/fig1/AS:11431281118768788@1675871400266/mage-corresponding-to-chest-X-ray-on-arrival-Cardiomegaly-with-notable-biatrial.png",
      color: "red",
      stats: [
        { value: "97%", label: "Detection Accuracy" },
        { value: "4 min", label: "Average Analysis Time" },
        { value: "90+", label: "Associated Conditions" }
      ],
      benefits: [
        "Cardiothoracic Ratio Calculation",
        "Chamber-Specific Analysis",
        "Longitudinal Tracking",
        "Risk Stratification"
      ]
    },
    {
      id: 'pulmonary-hypertension',
      title: "Pulmonary Hypertension",
      description: "Our system assists in identifying subtle indicators of pulmonary hypertension that complement conventional analysis, supporting earlier intervention decisions.",
      image: "https://media.istockphoto.com/id/592647828/photo/surgical-excellence-at-its-best.jpg?s=612x612&w=0&k=20&c=p0wpHB6865Xh8oiiOhf0iEDqCtxe9K1LjNq-3dMGYBc=",
      color: "purple",
      stats: [
        { value: "92%", label: "Detection Accuracy" },
        { value: "6 min", label: "Average Analysis Time" },
        { value: "Early", label: "Detection Stage" }
      ],
      benefits: [
        "Pulmonary Artery Measurement",
        "Vascular Pattern Recognition",
        "Integration with Clinical Data",
        "Progression Monitoring"
      ]
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };
  
  const statsItem = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  // Loading screen with animation
  if (isLoading) {
    return (
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-blue-900' : 'bg-gradient-to-br from-blue-900 to-blue-700'} flex items-center justify-center`}>
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path fill="currentColor" d="M50 15c19.33 0 35 15.67 35 35s-15.67 35-35 35-35-15.67-35-35 15.67-35 35-35z" opacity="0.5" />
              <path fill="currentColor" d="M92.71 60c-1.93 6.67-5.06 12.66-9.38 17.35-4.3 4.67-9.57 8.33-15.81 10.98-6.24 2.64-12.85 3.96-19.81 3.96-9.95 0-18.9-2.43-26.85-7.31-7.95-4.87-14.16-11.42-18.65-19.65-4.48-8.23-6.19-17.3-5.16-27.19C8.11 28.24 15.09 19.84 26 15">
                <animateTransform 
                  attributeName="transform" 
                  attributeType="XML" 
                  type="rotate" 
                  from="0 50 50" 
                  to="360 50 50" 
                  dur="1s" 
                  repeatCount="indefinite" />
              </path>
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            ChestCare AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-blue-100 mt-2"
          >
            Advanced diagnostic support tools
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-full h-full">
          {[...Array(30)].map((_, i) => (
            <motion.div 
            key={i}
              className={`absolute rounded-full ${isDarkMode ? 'bg-blue-400 opacity-10' : 'bg-blue-500 opacity-5'}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              transition={{ 
                duration: Math.random() * 50 + 50,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
            }}
          />
        ))}
        </div>
      </div>

      {/* Fixed Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800/90 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-md shadow-md'} py-4 px-6`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">ChestCare</span>
          </div>
          
          <div className="flex space-x-4 items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800'} transition-colors duration-200`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </motion.button>
          <Link 
            to="/login" 
              className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition-colors font-medium hidden md:block`}
          >
            Login
          </Link>
          <Link 
            to="/register"
              className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'shadow-blue-500/30' : ''}`}
          >
              Register
          </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 md:pr-16 mb-12 md:mb-0"
            >
              <h1 className={`text-4xl md:text-6xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight mb-6`}>
                Advanced <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">X-ray Analysis</span> Support
          </h1>
          
              <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                Enhancing diagnostic accuracy through machine learning-assisted chest X-ray analysis for healthcare professionals.
          </p>
          
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex gap-4 flex-wrap justify-center md:justify-start"
              >
            <Link to="/register">
                  <button className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-full text-lg ${isDarkMode ? 'shadow-xl shadow-blue-900/50' : 'shadow-xl hover:shadow-blue-200/50'}`}>
                Get Started
              </button>
            </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden rounded-3xl shadow-2xl"
                >
                  <img 
                    src={isDarkMode 
                      ? "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2022/08/heart-chest-x-ray-thumb.png"
                      : "https://www.healthimages.com/content/uploads/sites/2/2022/11/xray.jpg.webp"
                    }
                    alt="Chest X-ray scan"
                    className="w-full object-cover"
                  />
                </motion.div>
                
                {/* Floating stats cards */}
                <motion.div 
                  className={`absolute -bottom-4 -left-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-lg p-4 flex items-center gap-3`}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-full p-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analysis Support Rate</p>
                    <p className="text-lg font-bold">96.8%</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className={`absolute -top-4 -right-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-lg p-4 flex items-center gap-3`}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full p-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analysis Time</p>
                    <p className="text-lg font-bold">&lt; 5 mins</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Comprehensive Diagnostic Support</h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Our platform assists healthcare professionals in analyzing chest X-rays for multiple conditions with enhanced precision
            </p>
        </div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {diseases.map((disease) => (
              <motion.div
                key={disease.id}
                variants={statsItem}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className={`rounded-2xl ${isDarkMode ? 'bg-gray-700 shadow-gray-900/50' : 'bg-white shadow-lg'} overflow-hidden hover:shadow-xl transition-all cursor-pointer relative`}
                onClick={() => setActiveFeature(disease)}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 z-10" />
                  <img 
                    src={disease.image} 
                    alt={disease.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 text-white z-20">
                    <h3 className="text-xl font-bold">{disease.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6 line-clamp-3`}>
                    {disease.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Enhance Your Diagnostic Capabilities</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join healthcare professionals using ChestCare to support accurate chest X-ray analysis and diagnosis.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 max-w-xl mx-auto justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-1"
            >
              <Link 
                to="/register"
                className="inline-block w-full bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors shadow-xl"
              >
                Register
              </Link>
            </motion.div>
          </div>
          
          <p className="mt-8 text-blue-200">
            Start your journey with ChestCare today
          </p>
        </div>
      </motion.section>

      {/* Feature Modal */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveFeature(null)}
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={activeFeature.image} 
                  alt={activeFeature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <h2 className="text-3xl font-bold">{activeFeature.title}</h2>
                </div>
                <button 
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/40 transition-colors"
                  onClick={() => setActiveFeature(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-8`}>{activeFeature.description}</p>
                
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Key Statistics</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {activeFeature.stats.map((stat, index) => (
                    <div key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-xl`}>
                      <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{stat.value}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Benefits</h3>
                <ul className="mb-8 space-y-2">
                  {activeFeature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-2 mt-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isDarkMode ? 'text-gray-300' : ''}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">ChestCare AI</span>
              </div>
              <p className="text-gray-400 mb-6">
                Advanced diagnostic support for chest radiography analysis.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Solutions</h3>
              <ul className="space-y-2">
                {diseases.map(disease => (
                  <li key={disease.id}>
                    <a href={`#${disease.id}`} className="text-gray-400 hover:text-white transition-colors">
                      {disease.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/partners" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2025 ChestCare AI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;