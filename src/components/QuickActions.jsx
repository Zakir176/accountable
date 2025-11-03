import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, Download, Settings } from 'lucide-react';

const QuickActions = ({ onAddExpense, onViewGoals, onViewAnalytics, onExportData, onOpenSettings }) => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      description: 'Record new transaction',
      color: 'bg-[#00D1FF]',
      onClick: onAddExpense
    },
    {
      icon: Target,
      label: 'Goals',
      description: 'Track savings targets',
      color: 'bg-[#39FF14]',
      onClick: onViewGoals
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View insights',
      color: 'bg-[#8E44AD]',
      onClick: onViewAnalytics
    },
    {
      icon: Download,
      label: 'Export',
      description: 'Backup data',
      color: 'bg-[#FF4500]',
      onClick: onExportData
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Customize app',
      color: 'bg-[#BDC3C7]',
      onClick: onOpenSettings
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-6"
    >
      <h2 className="heading-2 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="flex flex-col items-center p-4 rounded-futuristic bg-[#2C3E50] hover:bg-[#34495E] transition-all group"
          >
            <div className={`p-3 rounded-full mb-3 group-hover:scale-110 transition-transform ${action.color}`}>
              <action.icon className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <span className="body-text font-semibold text-center text-sm mb-1">
              {action.label}
            </span>
            <span className="body-text-light text-xs text-center">
              {action.description}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;