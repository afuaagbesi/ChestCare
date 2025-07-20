import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative flex items-center justify-center w-14 h-7 rounded-full overflow-hidden focus:outline-none shadow-md"
      initial={false}
      animate={{ backgroundColor: isDarkMode ? '#1E293B' : '#FBBF24' }}
      transition={{ duration: 0.3 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div 
        className="absolute w-6 h-6 rounded-full shadow-md z-10 flex items-center justify-center"
        initial={false}
        animate={{ 
          x: isDarkMode ? '30%' : '-30%',
          backgroundColor: isDarkMode ? '#0F172A' : '#FEF3C7'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {isDarkMode ? (
          <FaMoon className="text-blue-300 text-sm" />
        ) : (
          <FaSun className="text-yellow-600 text-sm" />
        )}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <FaSun className={`text-white text-xs ${isDarkMode ? 'opacity-50' : 'opacity-0'}`} />
        <FaMoon className={`text-white text-xs ${isDarkMode ? 'opacity-0' : 'opacity-50'}`} />
      </div>
    </motion.button>
  );
}

export default DarkModeToggle; 