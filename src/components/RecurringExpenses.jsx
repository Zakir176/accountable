import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, Repeat } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RecurringExpenses = () => {
  const { categories, addExpense } = useApp();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecurring, setNewRecurring] = useState({
    description: '',
    amount: '',
    categoryId: categories[0]?.id || '',
    type: 'expense',
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0]
  });

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const addRecurringExpense = () => {
    if (!newRecurring.description || !newRecurring.amount) return;

    const expense = {
      ...newRecurring,
      id: Date.now().toString(),
      amount: parseFloat(newRecurring.amount)
    };

    setRecurringExpenses([...recurringExpenses, expense]);
    setNewRecurring({
      description: '',
      amount: '',
      categoryId: categories[0]?.id || '',
      type: 'expense',
      frequency: 'monthly',
      nextDate: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
  };

  const processRecurringExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    const toProcess = recurringExpenses.filter(expense => expense.nextDate <= today);

    toProcess.forEach(expense => {
      addExpense({
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        type: expense.type,
        date: today
      });

      // Update next date
      const nextDate = new Date(expense.nextDate);
      switch (expense.frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          break;
      }

      // Update recurring expense with new next date
      setRecurringExpenses(prev =>
        prev.map(re =>
          re.id === expense.id
            ? { ...re, nextDate: nextDate.toISOString().split('T')[0] }
            : re
        )
      );
    });

    if (toProcess.length > 0) {
      alert(`Processed ${toProcess.length} recurring expenses!`);
    }
  };

  const deleteRecurringExpense = (id) => {
    setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-2">Recurring Expenses</h2>
          <p className="body-text-light">Automate your regular transactions</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={processRecurringExpenses}
            className="btn-secondary flex items-center gap-2"
            disabled={!recurringExpenses.some(exp => exp.nextDate <= new Date().toISOString().split('T')[0])}
          >
            <Repeat className="w-4 h-4" />
            Process
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Add Recurring Expense Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-[#2C3E50] rounded-futuristic space-y-4"
        >
          <h3 className="heading-3">New Recurring Expense</h3>

          {/* ✅ Updated responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={newRecurring.description}
              onChange={(e) => setNewRecurring({ ...newRecurring, description: e.target.value })}
              className="glass-input px-3 py-2 col-span-2"
            />

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDC3C7]">$</span>
              <input
                type="number"
                placeholder="Amount"
                value={newRecurring.amount}
                onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value })}
                className="w-full glass-input pl-8 pr-3 py-2"
              />
            </div>

            <select
              value={newRecurring.frequency}
              onChange={(e) => setNewRecurring({ ...newRecurring, frequency: e.target.value })}
              className="glass-input px-3 py-2"
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </select>

            <select
              value={newRecurring.categoryId}
              onChange={(e) => setNewRecurring({ ...newRecurring, categoryId: e.target.value })}
              className="glass-input px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={newRecurring.type}
              onChange={(e) => setNewRecurring({ ...newRecurring, type: e.target.value })}
              className="glass-input px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addRecurringExpense}
              className="btn-primary flex-1"
            >
              Save Recurring
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="btn-secondary px-4"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* ✅ Updated responsive recurring expenses list */}
      <div className="space-y-3">
        {recurringExpenses.map((expense, index) => {
          const category = categories.find(cat => cat.id === expense.categoryId);
          const isDue = expense.nextDate <= new Date().toISOString().split('T')[0];

          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-futuristic transition-all ${
                isDue
                  ? 'bg-[#FF4500]/20 border border-[#FF4500]/30'
                  : 'bg-[#2C3E50] hover:bg-[#34495E]'
              }`}
            >
              <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: category?.color || '#00D1FF' }}
                >
                  <Repeat className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="body-text font-semibold truncate">{expense.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="body-text-light text-sm capitalize">{expense.frequency}</p>
                    <div className="flex items-center gap-1 text-[#BDC3C7] text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>Next: {expense.nextDate}</span>
                    </div>
                    {isDue && (
                      <span className="text-warning text-sm font-semibold bg-[#FF4500]/20 px-2 py-1 rounded">
                        Due
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3">
                <p
                  className={`heading-3 ${
                    expense.type === 'income' ? 'text-success' : 'text-warning'
                  }`}
                >
                  {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteRecurringExpense(expense.id)}
                  className="text-[#BDC3C7] hover:text-[#FF4500] p-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}

        {recurringExpenses.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <Repeat className="w-12 h-12 text-[#BDC3C7] mx-auto mb-3" />
            <p className="body-text-light">No recurring expenses yet</p>
            <p className="body-text-light text-sm">
              Add your first recurring expense to automate your finances
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecurringExpenses;
