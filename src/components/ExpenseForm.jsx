import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Tag, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ExpenseForm = ({ onClose, editExpense = null }) => {
  const { addExpense, updateExpense, categories } = useApp();
  const [formData, setFormData] = useState({
    amount: editExpense?.amount || '',
    description: editExpense?.description || '',
    categoryId: editExpense?.categoryId || categories[0]?.id || '',
    date: editExpense?.date || new Date().toISOString().split('T')[0],
    type: editExpense?.type || 'expense'
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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-futuristic rounded-futuristic p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-2 text-accent">
            {editExpense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-[#BDC3C7] hover:text-[#ECF0F1]"
          >
            <X className="w-6 h-6" />
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
                className={`flex-1 py-2 px-4 rounded-futuristic transition-all ${
                  formData.type === type.value
                    ? `${type.color} text-[#1A1A1A] font-semibold`
                    : 'bg-[#2C3E50] text-[#BDC3C7] hover:bg-[#34495E]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="body-text-light">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7] w-5 h-5" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3 placeholder-[#BDC3C7]"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="body-text-light">Description</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input px-4 py-3 placeholder-[#BDC3C7]"
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="body-text-light">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7] w-5 h-5" />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3 appearance-none"
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
                <span className="body-text-light text-xs">
                  {selectedCategory.name}
                </span>
              </div>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <label className="body-text-light">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7] w-5 h-5" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary mt-4"
          >
            {editExpense ? 'Update Expense' : 'Add Expense'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;