import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';

const Analytics = () => {
  const { expenses, categories, getTotals } = useApp();
  const totals = getTotals();

  // Calculate category-wise spending
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(
      expense => expense.categoryId === category.id && expense.type === 'expense'
    );
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color,
      percentage: totals.totalExpenses > 0 ? (total / totals.totalExpenses) * 100 : 0
    };
  }).filter(item => item.value > 0);

  // Monthly data for bar chart
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear() &&
             expense.type === 'expense';
    });
    
    const monthIncome = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear() &&
             expense.type === 'income';
    });

    return {
      month: monthYear,
      expenses: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      income: monthIncome.reduce((sum, expense) => sum + expense.amount, 0)
    };
  }).reverse();

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="heading-1">Analytics</h1>
        <p className="body-text-light">Understand your spending patterns</p>
      </motion.div>

      {/* Spending Distribution */}
      {categoryData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-futuristic p-6"
        >
          <h2 className="heading-2 text-center mb-4">Spending Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {categoryData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="body-text flex-1">{item.name}</span>
                <span className="body-text-light">{item.percentage.toFixed(1)}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-futuristic p-6 text-center"
        >
          <h2 className="heading-2 mb-2">No Data Yet</h2>
          <p className="body-text-light">Add some expenses to see analytics</p>
        </motion.div>
      )}

      {/* Monthly Trends */}
      {monthlyData.some(month => month.expenses > 0 || month.income > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-futuristic p-6"
        >
          <h2 className="heading-2 mb-4">Monthly Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2C3E50" />
                <XAxis dataKey="month" stroke="#BDC3C7" />
                <YAxis stroke="#BDC3C7" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2C3E50',
                    border: '1px solid #00D1FF',
                    borderRadius: '10px',
                    color: '#ECF0F1'
                  }}
                />
                <Bar dataKey="income" fill="#39FF14" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#FF4500" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-futuristic p-6"
      >
        <h2 className="heading-2 mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {[
            { 
              label: 'Monthly Budget', 
              spent: totals.totalExpenses, 
              total: totals.monthlyBudget, 
              percentage: (totals.totalExpenses / totals.monthlyBudget) * 100,
              type: 'budget'
            },
            { 
              label: 'Income vs Expenses', 
              spent: totals.totalExpenses, 
              total: totals.totalIncome, 
              percentage: totals.totalIncome > 0 ? (totals.totalExpenses / totals.totalIncome) * 100 : 0,
              type: 'comparison'
            },
          ].map((summary, index) => (
            <div key={summary.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="body-text">{summary.label}</span>
                <span className={`body-text ${
                  summary.type === 'budget' 
                    ? (summary.percentage > 100 ? 'text-warning' : 'text-success')
                    : (summary.percentage > 80 ? 'text-warning' : 'text-success')
                }`}>
                  ${summary.spent.toFixed(2)} / ${summary.total.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[#2C3E50] rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(summary.percentage, 100)}%` }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 1 }}
                  className={`h-2 rounded-full ${
                    summary.type === 'budget'
                      ? (summary.percentage > 100 ? 'bg-warning' : 'bg-success')
                      : (summary.percentage > 80 ? 'bg-warning' : 'bg-success')
                  }`}
                />
              </div>
              <p className="body-text-light text-xs text-right">
                {summary.percentage.toFixed(1)}% {summary.type === 'budget' ? 'of budget used' : 'spending ratio'}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;