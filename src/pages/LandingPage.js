import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const diseaseFeatures = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.152 9.432l-3.077-2.062A1 1 0 0010 8.219v7.562a1 1 0 001.075.218A9 9 0 0021 12a9 9 0 10-9 9 9 9 0 009-9c0-1.537-.39-2.985-1.075-4.218z" />
        </svg>
      ),
      title: "Pneumonia Detection",
      description: "Accurate AI-powered screening for pneumonia indicators"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: "Tuberculosis Screening",
      description: "Advanced machine learning for TB diagnosis"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8V5a3 3 0 00-3-3H7a3 3 0 00-3 3v14a3 3 0 003 3h9a3 3 0 003-3v-2M9 12h12m0 0l-4-4m4 4l-4 4" />
        </svg>
      ),
      title: "Cardiomegaly Analysis",
      description: "Comprehensive heart enlargement assessment"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Pulmonary Hypertension",
      description: "Early detection of pulmonary vascular conditions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col overflow-hidden">
      {/* Animated Background Dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-blue-100 rounded-full opacity-30 animate-blob"
            style={{
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            CC
          </div>
          <span className="text-2xl font-bold text-gray-800">ChestCare</span>
        </div>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Login
          </Link>
          <Link 
            to="/register"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-grow container mx-auto px-6 flex items-center justify-between">
        <div className="w-1/2 space-y-6 transform transition-all duration-700 hover:scale-[1.02]">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight animate-fade-in-left">
            AI-Powered Chest X-ray Diagnostics
          </h1>
          
          <p className="text-xl text-gray-600 animate-fade-in-right">
            Advanced machine learning to detect critical chest conditions with unprecedented accuracy and precision.
          </p>
          
          <div className="animate-bounce-in">
            <Link to="/register">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-3xl">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Image Placeholder with Hover Effect */}
        <div className="w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-3xl">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 h-80 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-blue-800 font-semibold">Medical Imaging Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Detection Features */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-8">
          {diseaseFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-2 duration-300"
            >
              <div className="flex justify-center mb-4 animate-pulse-slow">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;