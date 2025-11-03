import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExpenseList from './ExpenseList';
import SearchFilter from './SearchFilter';

const Dashboard = () => {
  const { getTotals, expenses } = useApp();
  const [filters, setFilters] = useState({});
  const totals = getTotals();

  // Filter expenses based on search/filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const descriptionMatch = expense.description.toLowerCase().includes(searchTerm);
        const category = categories.find(cat => cat.id === expense.categoryId);
        const categoryMatch = category?.name.toLowerCase().includes(searchTerm);
        if (!descriptionMatch && !categoryMatch) return false;
      }

      // Category filter
      if (filters.category && expense.categoryId !== filters.category) return false;

      // Type filter
      if (filters.type && expense.type !== filters.type) return false;

      // Date range filter
      if (filters.dateFrom && expense.date < filters.dateFrom) return false;
      if (filters.dateTo && expense.date > filters.dateTo) return false;

      // Amount range filter
      if (filters.amountMin && expense.amount < parseFloat(filters.amountMin)) return false;
      if (filters.amountMax && expense.amount > parseFloat(filters.amountMax)) return false;

      return true;
    });
  }, [expenses, filters]);

  const cards = [
    { 
      label: 'Total Balance', 
      value: `$${totals.balance.toFixed(2)}`, 
      icon: Wallet, 
      trend: totals.balance >= 0 ? 'up' : 'down', 
      color: totals.balance >= 0 ? 'text-success' : 'text-warning' 
    },
    { 
      label: 'This Month', 
      value: `$${totals.totalIncome.toFixed(2)}`, 
      icon: TrendingUp, 
      trend: 'up', 
      color: 'text-accent' 
    },
    { 
      label: 'Expenses', 
      value: `$${totals.totalExpenses.toFixed(2)}`, 
      icon: TrendingDown, 
      trend: 'down', 
      color: 'text-warning' 
    },
    { 
      label: 'Budget Left', 
      value: `$${totals.budgetRemaining.toFixed(2)}`, 
      icon: Target, 
      trend: totals.budgetRemaining >= 0 ? 'up' : 'down', 
      color: totals.budgetRemaining >= 0 ? 'text-success' : 'text-warning' 
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="heading-1 text-glow">Accountable</h1>
        <p className="body-text-light">Your financial clarity starts here</p>
      </motion.div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-futuristic p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="body-text-light">{card.label}</p>
                <p className={`heading-3 mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <SearchFilter onFilterChange={setFilters} />

      {/* Recent Activity */}
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
};

export default Dashboard;