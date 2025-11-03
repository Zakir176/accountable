import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  // Temporary toggle until we implement full theme system
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Will be connected to theme context later
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-futuristic glass-button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#FFD700]" />
      ) : (
        <Moon className="w-5 h-5 text-[#1A1A1A]" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;