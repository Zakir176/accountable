// src/components/ExpenseForm.jsx - UPDATED (Responsive)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, DollarSign, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

const ExpenseForm = ({ onClose, editExpense = null }) => {
  const { addExpense, updateExpense, categories } = useApp();
  const { isDark } = useTheme();
  const { baseCurrency, currencies, formatAmount } = useCurrency();
  const [formData, setFormData] = useState({
    amount: editExpense?.amount || '',
    description: editExpense?.description || '',
    categoryId: editExpense?.categoryId || categories[0]?.id || '',
    date: editExpense?.date || new Date().toISOString().split('T')[0],
    type: editExpense?.type || 'expense',
    currency: editExpense?.currency || baseCurrency
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId
    };

    if (editExpense) {
      updateExpense({ ...editExpense, ...expenseData });
    } else {
      addExpense(expenseData);
    }

    onClose();
  };

  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-futuristic rounded-futructive p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-[var(--bg-card)] py-2 -mt-2">
          <h2 className="heading-2 text-accent text-lg sm:text-xl">
            {editExpense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-secondary hover:text-primary p-1"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2 mb-4">
            {[
              { value: 'expense', label: 'Expense', color: 'bg-warning' },
              { value: 'income', label: 'Income', color: 'bg-success' }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.value })}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-futuristic transition-all text-sm sm:text-base ${
                  formData.type === type.value
                    ? `${type.color} text-white font-semibold`
                    : 'bg-secondary text-secondary hover:text-primary'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Amount Input with Currency */}
          <div className="space-y-2">
            <label className="body-text-light text-sm sm:text-base">Amount</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full glass-input pl-9 sm:pl-10 pr-4 py-3 placeholder-secondary text-sm sm:text-base"
                  required
                />
              </div>
              
              {/* Currency Selector */}
              <div className="relative w-full sm:w-28">
                <Globe className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full glass-input pl-8 sm:pl-10 pr-6 sm:pr-4 py-3 appearance-none text-sm sm:text-base"
                >
                  {Object.values(currencies).map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {formData.amount && (
              <p className="text-xs text-secondary">
                ≈ {formatAmount(parseFloat(formData.amount) || 0, formData.currency)}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="body-text-light text-sm sm:text-base">Description</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input px-4 py-3 placeholder-secondary text-sm sm:text-base"
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="body-text-light text-sm sm:text-base">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full glass-input pl-10 sm:pl-12 pr-4 py-3 appearance-none text-sm sm:text-base"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {selectedCategory && (
              <div className="flex items-center gap-2 mt-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span className="body-text-light text-xs sm:text-sm">
                  {selectedCategory.name}
                </span>
              </div>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="body-text-light text-sm sm:text-base">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full glass-input pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary mt-4 py-3 text-sm sm:text-base"
          >
            {editExpense ? 'Update Expense' : 'Add Expense'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;