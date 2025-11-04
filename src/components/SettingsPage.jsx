// src/components/SettingsPage.jsx - FULL UPDATED
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Repeat, 
  Settings as SettingsIcon, 
  Folder, 
  FileDown,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import DataExport from './DataExport';
import RecurringExpenses from './RecurringExpenses';
import CurrencySelector from './CurrencySelector';

const SettingsPage = () => {
  const { categories, addCategory, deleteCategory, budgets, updateBudget } = useApp();
  const { isDark } = useTheme();
  const { baseCurrency, exchangeRates, isLoadingRates, refreshRates } = useCurrency();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: isDark ? '#00D1FF' : '#007BFF' });
  const [monthlyBudget, setMonthlyBudget] = useState(budgets.monthly || 1200);
  const [activeSection, setActiveSection] = useState('general');

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', color: isDark ? '#00D1FF' : '#007BFF' });
      setIsAddingCategory(false);
    }
  };

  const handleUpdateBudget = () => {
    updateBudget({ monthly: parseFloat(monthlyBudget) });
  };

  const colorOptions = isDark ? [
    '#00D1FF', '#39FF14', '#8E44AD', '#FF4500', '#FF6B6B', 
    '#FFD700', '#00FF7F', '#9370DB', '#20B2AA', '#FF69B4'
  ] : [
    '#007BFF', '#28A745', '#6F42C1', '#DC3545', '#E83E8C',
    '#FFC107', '#20C997', '#6F42C1', '#17A2B8', '#E83E8C'
  ];

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon, description: 'Budget and basic settings' },
    { id: 'currency', label: 'Currency', icon: Globe, description: 'Currency and exchange rates' },
    { id: 'categories', label: 'Categories', icon: Folder, description: 'Manage expense categories' },
    { id: 'recurring', label: 'Recurring', icon: Repeat, description: 'Automated transactions' },
    { id: 'export', label: 'Export', icon: FileDown, description: 'Backup your data' }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} onUpdateBudget={handleUpdateBudget} />;
      case 'currency':
        return <CurrencySettings />;
      case 'categories':
        return <CategorySettings
          categories={categories}
          isAddingCategory={isAddingCategory}
          setIsAddingCategory={setIsAddingCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          colorOptions={colorOptions}
          onAddCategory={handleAddCategory}
          onDeleteCategory={deleteCategory}
        />;
      case 'recurring':
        return <RecurringExpenses />;
      case 'export':
        return <DataExport />;
      default:
        return <GeneralSettings monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget} onUpdateBudget={handleUpdateBudget} />;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="text-center space-y-2">
          <h1 className="heading-1 text-glow text-primary">Settings</h1>
          <p className="body-text-light">Customize your financial tracking experience</p>
        </div>
      </motion.div>

      <div className="px-4 space-y-6">
        {/* Mobile Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-futuristic p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 py-3 px-4 rounded-futuristic transition-all min-w-0 ${
                  activeSection === section.id
                    ? 'bg-accent-gradient text-white font-semibold shadow-lg'
                    : 'text-secondary hover:text-primary hover:bg-secondary'
                }`}
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{section.label}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ✅ Currency Settings Component
const CurrencySettings = () => {
  const { baseCurrency, currencies, exchangeRates, isLoadingRates, refreshRates } = useCurrency();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-futuristic p-6 space-y-6">
      <div>
        <h2 className="heading-2 mb-2 text-primary">Currency Settings</h2>
        <p className="body-text-light">Manage your base currency and exchange rates</p>
      </div>

      {/* Base Currency Selection */}
      <div className="space-y-4">
        <div>
          <label className="body-text font-semibold text-primary mb-3 block">Base Currency</label>
          <div className="flex items-center gap-4">
            <CurrencySelector />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshRates}
              disabled={isLoadingRates}
              className="flex items-center gap-2 px-4 py-2 bg-accent-gradient text-white rounded-futuristic font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingRates ? 'animate-spin' : ''}`} />
              Refresh Rates
            </motion.button>
          </div>
          <p className="body-text-light text-sm mt-2">
            All amounts will be converted and displayed in your base currency
          </p>
        </div>

        {/* Exchange Rates */}
        <div className="space-y-3">
          <h3 className="body-text font-semibold text-primary">Current Exchange Rates</h3>
          <div className="glass-card rounded-futuristic p-4">
            <div className="space-y-2">
              {Object.entries(exchangeRates)
                .filter(([currency]) => currency !== baseCurrency)
                .map(([currency, rate]) => (
                  <motion.div
                    key={currency}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-futuristic bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <span className="body-text font-semibold text-primary">
                        1 {baseCurrency}
                      </span>
                      <span className="body-text-light">=</span>
                    </div>
                    <div className="text-right">
                      <span className="body-text font-semibold text-primary">
                        {rate.toFixed(4)} {currency}
                      </span>
                      <p className="body-text-light text-xs">
                        {currencies?.[currency]?.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ GeneralSettings and CategorySettings remain unchanged (from your version)
const GeneralSettings = ({ monthlyBudget, setMonthlyBudget, onUpdateBudget }) => { /* ... your existing code ... */ };
const CategorySettings = ({ categories, isAddingCategory, setIsAddingCategory, newCategory, setNewCategory, colorOptions, onAddCategory, onDeleteCategory }) => { /* ... your existing code ... */ };

export default SettingsPage;
