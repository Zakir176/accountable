// src/components/Analytics.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const Analytics = () => {
  const { expenses, categories } = useApp();
  const { colors, isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('pie');
  const containerRef = useRef(null);

  // Filter expenses based on time range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    return expenses.filter(expense => new Date(expense.date) >= startDate);
  }, [expenses, timeRange]);

  // Calculate category totals
  const categoryData = useMemo(() => {
    const categoryTotals = {};

    filteredExpenses.forEach(expense => {
      if (expense.type === 'expense') {
        const category = categories.find(cat => cat.id === expense.categoryId) || { name: 'Uncategorized', color: '#BDC3C7' };
        if (!categoryTotals[category.name]) {
          categoryTotals[category.name] = {
            name: category.name,
            value: 0,
            color: category.color
          };
        }
        categoryTotals[category.name].value += expense.amount;
      }
    });

    return Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  }, [filteredExpenses, categories]);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthlyTotals = {};
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: monthName,
          income: 0,
          expenses: 0
        };
      }

      if (expense.type === 'income') {
        monthlyTotals[monthKey].income += expense.amount;
      } else {
        monthlyTotals[monthKey].expenses += expense.amount;
      }
    });

    return Object.values(monthlyTotals)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  }, [filteredExpenses]);

  // Stats cards
  const stats = useMemo(() => {
    const totalIncome = filteredExpenses
      .filter(exp => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const totalExpenses = filteredExpenses
      .filter(exp => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const averageExpense = totalExpenses / Math.max(categoryData.length, 1);
    const largestExpense = Math.max(...filteredExpenses.filter(exp => exp.type === 'expense').map(exp => exp.amount), 0);

    return [
      {
        label: 'Total Income',
        value: `$${totalIncome.toFixed(2)}`,
        icon: TrendingUp,
        color: 'text-success'
      },
      {
        label: 'Total Expenses',
        value: `$${totalExpenses.toFixed(2)}`,
        icon: BarChart3,
        color: 'text-warning'
      },
      {
        label: 'Avg. Expense',
        value: `$${averageExpense.toFixed(2)}`,
        icon: PieChartIcon,
        color: 'text-accent'
      },
      {
        label: 'Largest Expense',
        value: `$${largestExpense.toFixed(2)}`,
        icon: Calendar,
        color: 'text-warning'
      }
    ];
  }, [filteredExpenses, categoryData]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-futuristic p-3 border border-border-color">
          <p className="body-text font-semibold text-primary">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="body-text-light" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Chart container with proper dimensions
  const ChartContainer = ({ children, height = 300 }) => (
    <div className="w-full" style={{ height: `${height}px`, minHeight: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        {children}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6" ref={containerRef}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="heading-1 text-primary mb-2">Analytics</h1>
        <p className="body-text-light">Gain insights into your spending patterns</p>
      </motion.div>

      {/* Time Range Filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-futuristic p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="heading-3 text-primary">Time Range</h2>
          <div className="flex flex-wrap gap-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-futuristic transition-all capitalize ${
                  timeRange === range
                    ? 'bg-accent-gradient text-white font-semibold'
                    : 'bg-secondary text-secondary hover:text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-futuristic p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-text-light text-sm sm:text-base">{stat.label}</p>
                  <p className={`text-lg sm:text-xl font-bold mt-1 sm:mt-2 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-secondary">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Type Toggle */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-futuristic p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="heading-3 text-primary">Chart Type</h2>
          <div className="flex gap-2">
            {[
              { type: 'pie', label: 'Pie Chart', icon: PieChartIcon },
              { type: 'bar', label: 'Bar Chart', icon: BarChart3 }
            ].map((chart) => (
              <button
                key={chart.type}
                onClick={() => setChartType(chart.type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-futuristic transition-all ${
                  chartType === chart.type
                    ? 'bg-accent-gradient text-white font-semibold'
                    : 'bg-secondary text-secondary hover:text-primary'
                }`}
              >
                <chart.icon className="w-4 h-4" />
                <span>{chart.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-futuristic p-4 sm:p-6"
        >
          <h3 className="heading-3 text-primary mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ChartContainer height={300}>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={colors.textSecondary}
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke={colors.textSecondary}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={colors.accent1}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="body-text-light text-center">No expense data available for the selected time range</p>
            </div>
          )}
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-futuristic p-4 sm:p-6"
        >
          <h3 className="heading-3 text-primary mb-4">Monthly Trends</h3>
          {monthlyData.length > 0 ? (
            <ChartContainer height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
                <XAxis 
                  dataKey="month" 
                  stroke={colors.textSecondary}
                  fontSize={12}
                />
                <YAxis 
                  stroke={colors.textSecondary}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" fill={colors.accent2} name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill={colors.warning} name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="body-text-light text-center">No trend data available for the selected time range</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-futuristic p-4 sm:p-6 mt-6"
        >
          <h3 className="heading-3 text-primary mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-futuristic bg-secondary"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="body-text font-semibold text-primary">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="body-text font-semibold text-primary">${category.value.toFixed(2)}</p>
                  <p className="body-text-light text-xs">
                    {((category.value / categoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;