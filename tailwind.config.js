module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Scan all files in the src directory for Tailwind classes
    "./public/index.html"
  ],
  darkMode: 'class', // Use the 'class' value to enable dark mode
  theme: {
    extend: {
      // Customizations to Tailwind's default theme go here
      colors: {
        primary: '#3490dc', // Example of adding a custom primary color
        secondary: '#ff7a5c', 
        dark: {
          bg: '#1a202c',
          card: '#2d3748',
          text: '#e2e8f0',
          border: '#4a5568'
        },
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
        'dark-text': '#E5E5E5',
        'dark-border': '#333333',
        'dark-hover': '#2C2C2C',
        'dark-button': '#3B82F6',
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'], // Example of custom font
      },
      // You can extend other properties like spacing, typography, etc.
    }
  },
  plugins: []   
};