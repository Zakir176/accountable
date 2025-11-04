// src/components/ThemeAwareButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeAwareButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const { colors } = useTheme();

  const baseClasses = "rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  };

  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.highlight} 100%)`,
      color: 'white',
      boxShadow: `0 4px 16px ${colors.accent1}25`
    },
    secondary: {
      backgroundColor: `${colors.accent1}10`,
      color: colors.accent1,
      border: `1px solid ${colors.accent1}30`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text,
      border: `1px solid ${colors.text}20`
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
      }`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ThemeAwareButton;