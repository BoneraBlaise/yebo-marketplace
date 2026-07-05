import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      // Check if there's a saved theme in localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }

      // Check the device's preferred theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light'; // Default theme if window is not available (e.g., SSR)
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Update the theme in localStorage and on the document body
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark', theme === 'dark'); // Apply the dark class to <body>
    
     // Set background color for the entire site based on the theme
     if (theme === "dark") {
      document.body.style.backgroundColor = "#1f1f1f";
    } else {
      document.body.style.backgroundColor = ""; // Reset background to default for light theme
    }
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        // Only change the theme if the user hasn't manually set a theme
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Attach the event listener to listen for system theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Cleanup the listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};
