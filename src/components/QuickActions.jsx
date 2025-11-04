import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, Download, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const QuickActions = ({ onAddExpense, onViewGoals, onViewAnalytics, onExportData, onOpenSettings }) => {
  const { isDark } = useTheme();

  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      description: 'Record new transaction',
      color: isDark ? 'bg-[#00D1FF]' : 'bg-[#007BFF]',
      onClick: onAddExpense
    },
    {
      icon: Target,
      label: 'Goals',
      description: 'Track savings targets',
      color: isDark ? 'bg-[#39FF14]' : 'bg-[#28A745]',
      onClick: onViewGoals
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View insights',
      color: isDark ? 'bg-[#8E44AD]' : 'bg-[#6F42C1]',
      onClick: onViewAnalytics
    },
    {
      icon: Download,
      label: 'Export',
      description: 'Backup data',
      color: isDark ? 'bg-[#FF4500]' : 'bg-[#DC3545]',
      onClick: onExportData
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Customize app',
      color: isDark ? 'bg-[#BDC3C7]' : 'bg-[#6C757D]',
      onClick: onOpenSettings
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-4 sm:p-6 w-full"
    >
      <h2 className="heading-2 mb-3 sm:mb-4 text-primary">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 w-full">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex flex-col items-center p-2 sm:p-3 lg:p-4 rounded-futuristic bg-secondary hover:bg-[var(--border-color)] transition-all group w-full min-w-0"
          >
            <div className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform ${action.color}`}>
              <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="body-text font-semibold text-center text-xs sm:text-sm mb-1 truncate w-full text-primary">
              {action.label}
            </span>
            <span className="body-text-light text-xs text-center hidden sm:block truncate w-full">
              {action.description}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;