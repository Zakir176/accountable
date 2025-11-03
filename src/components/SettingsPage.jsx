import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Download, 
  Repeat, 
  Settings as SettingsIcon, 
  Folder, 
  FileDown 
} from 'lucide-react'; // Removed Refresh, using Repeat instead
import { useApp } from '../context/AppContext';
import DataExport from './DataExport';
import RecurringExpenses from './RecurringExpenses';

const SettingsPage = () => {
  const { categories, addCategory, deleteCategory, budgets, updateBudget } = useApp();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#00D1FF' });
  const [monthlyBudget, setMonthlyBudget] = useState(budgets.monthly || 1200);
  const [activeSection, setActiveSection] = useState('general');

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', color: '#00D1FF' });
      setIsAddingCategory(false);
    }
  };

  const handleUpdateBudget = () => {
    updateBudget({ monthly: parseFloat(monthlyBudget) });
  };

  const colorOptions = [
    '#00D1FF', '#39FF14', '#8E44AD', '#FF4500', '#FF6B6B', 
    '#FFD700', '#00FF7F', '#9370DB', '#20B2AA', '#FF69B4'
  ];

  const sections = [
    { 
      id: 'general', 
      label: 'General', 
      icon: SettingsIcon,
      description: 'Budget and basic settings'
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: Folder,
      description: 'Manage expense categories'
    },
    { 
      id: 'recurring', 
      label: 'Recurring', 
      icon: Repeat, // Using Repeat instead of Refresh
      description: 'Automated transactions'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: FileDown,
      description: 'Backup your data'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings 
          monthlyBudget={monthlyBudget} 
          setMonthlyBudget={setMonthlyBudget}
          onUpdateBudget={handleUpdateBudget}
        />;
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
        return <GeneralSettings 
          monthlyBudget={monthlyBudget} 
          setMonthlyBudget={setMonthlyBudget}
          onUpdateBudget={handleUpdateBudget}
        />;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="text-center space-y-2">
          <h1 className="heading-1 text-glow">Settings</h1>
          <p className="body-text-light">Customize your financial tracking experience</p>
        </div>
      </motion.div>

      <div className="px-4 space-y-6">
        {/* Mobile Navigation - Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-futuristic p-4"
        >
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 py-3 px-4 rounded-futuristic transition-all min-w-0 ${
                  activeSection === section.id
                    ? 'bg-[#00D1FF] text-[#1A1A1A] font-semibold shadow-lg'
                    : 'text-[#BDC3C7] hover:text-[#ECF0F1] hover:bg-[#34495E] bg-[#2C3E50]'
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

// General Settings Component
const GeneralSettings = ({ monthlyBudget, setMonthlyBudget, onUpdateBudget }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-6 space-y-6"
    >
      <div>
        <h2 className="heading-2 mb-2">Budget Settings</h2>
        <p className="body-text-light">Set your monthly spending limit</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <label className="body-text font-semibold">Monthly Budget</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7]">$</span>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full glass-input pl-8 pr-4 py-3 text-lg"
                placeholder="Enter monthly budget"
                min="0"
                step="0.01"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpdateBudget}
              className="btn-primary whitespace-nowrap px-6 py-3 text-lg sm:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Budget
            </motion.button>
          </div>
        </div>

        {/* Budget Preview */}
        <div className="p-4 bg-[#2C3E50] rounded-futuristic space-y-3">
          <h3 className="body-text font-semibold">Budget Preview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="body-text-light">Daily Average:</span>
              <span className="body-text ml-2">${(monthlyBudget / 30).toFixed(2)}</span>
            </div>
            <div>
              <span className="body-text-light">Weekly Average:</span>
              <span className="body-text ml-2">${(monthlyBudget / 4.33).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Category Settings Component
const CategorySettings = ({
  categories,
  isAddingCategory,
  setIsAddingCategory,
  newCategory,
  setNewCategory,
  colorOptions,
  onAddCategory,
  onDeleteCategory
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="heading-2 mb-2">Categories</h2>
          <p className="body-text-light">Organize your expenses with custom categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingCategory(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </motion.button>
      </div>

      {/* Add Category Form */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[#2C3E50] rounded-futuristic space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="heading-3">New Category</h3>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="text-[#BDC3C7] hover:text-[#ECF0F1] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="body-text-light text-sm mb-2 block">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full glass-input px-4 py-3"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="body-text-light text-sm mb-3 block">Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategory.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onAddCategory}
                disabled={!newCategory.name.trim()}
                className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#2C3E50] rounded-futuristic p-4 hover:bg-[#34495E] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="body-text font-semibold truncate">{category.name}</span>
              </div>
              
              {!['1', '2', '3', '4', '5', '6', '7'].includes(category.id) && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-[#BDC3C7] hover:text-[#FF4500] p-2 transition-colors flex-shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-[#BDC3C7] mx-auto mb-3" />
          <p className="body-text-light">No categories yet</p>
          <p className="body-text-light text-sm">Create your first category to organize expenses</p>
        </div>
      )}
    </motion.div>
  );
};

export default SettingsPage;