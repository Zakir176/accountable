import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExpenseForm from './ExpenseForm';

const ExpenseList = ({ expenses: propExpenses }) => {
  const { expenses, categories, deleteExpense } = useApp();
  const [editingExpense, setEditingExpense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Use prop expenses if provided, otherwise fall back to context expenses
  const expensesToShow = propExpenses || expenses;

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const sortedExpenses = expensesToShow
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10); // Show only last 10 expenses

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  if (expensesToShow.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-futuristic p-6 text-center"
      >
        <h2 className="heading-2 mb-2">No Expenses Yet</h2>
        <p className="body-text-light">Add your first expense to get started!</p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-futuristic p-6"
      >
        <h2 className="heading-2 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {sortedExpenses.map((expense, index) => {
            const category = getCategoryById(expense.categoryId);
            const expenseDate = new Date(expense.date).toLocaleDateString();

            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-futuristic bg-[#2C3E50] hover:bg-[#34495E] transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-[#1A1A1A] font-bold text-sm">
                      {category.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="body-text font-semibold">{expense.description}</p>
                    <p className="body-text-light">{category.name} • {expenseDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
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
                    onClick={() => handleEdit(expense)}
                    className="text-[#BDC3C7] hover:text-[#00D1FF] p-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteExpense(expense.id)}
                    className="text-[#BDC3C7] hover:text-[#FF4500] p-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Edit Expense Form */}
      <AnimatePresence>
        {isFormOpen && (
          <ExpenseForm 
            onClose={handleCloseForm} 
            editExpense={editingExpense}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpenseList;
