import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExpenseList from './ExpenseList';
import SearchFilter from './SearchFilter';
import FinancialGoals from './FinancialGoals';
import QuickActions from './QuickActions';
import Notifications from './Notifications';

const Dashboard = ({ onAddExpense, onViewGoals, onViewAnalytics, onExportData, onOpenSettings }) => {
  const { getTotals, expenses } = useApp();
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState('overview'); // 'overview' or 'goals'
  const totals = getTotals();

  // Filter expenses based on search/filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const descriptionMatch = expense.description.toLowerCase().includes(searchTerm);
        if (!descriptionMatch) return false;
      }

      if (filters.category && expense.categoryId !== filters.category) return false;
      if (filters.type && expense.type !== filters.type) return false;
      if (filters.dateFrom && expense.date < filters.dateFrom) return false;
      if (filters.dateTo && expense.date > filters.dateTo) return false;
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
      {/* Header with Notifications */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="text-center flex-1">
          <h1 className="heading-1 text-glow">Accountable</h1>
          <p className="body-text-light">Your financial clarity starts here</p>
        </div>
        <div className="flex gap-2">
          <Notifications />
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-futuristic p-4"
      >
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-3 px-4 rounded-futuristic transition-all ${
              activeView === 'overview'
                ? 'bg-[#00D1FF] text-[#1A1A1A] font-semibold'
                : 'text-[#BDC3C7] hover:text-[#ECF0F1] hover:bg-[#34495E]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('goals')}
            className={`flex-1 py-3 px-4 rounded-futuristic transition-all ${
              activeView === 'goals'
                ? 'bg-[#00D1FF] text-[#1A1A1A] font-semibold'
                : 'text-[#BDC3C7] hover:text-[#ECF0F1] hover:bg-[#34495E]'
            }`}
          >
            Goals
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      {activeView === 'overview' && (
        <QuickActions
          onAddExpense={onAddExpense}
          onViewGoals={() => setActiveView('goals')}
          onViewAnalytics={onViewAnalytics}
          onExportData={onExportData}
          onOpenSettings={onOpenSettings}
        />
      )}

      {/* Financial Overview Cards */}
      {activeView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
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
        </motion.div>
      )}

      {/* Search & Filter */}
      {activeView === 'overview' && (
        <SearchFilter onFilterChange={setFilters} />
      )}

      {/* Content based on active view */}
      {activeView === 'overview' ? (
        <ExpenseList expenses={filteredExpenses} />
      ) : (
        <FinancialGoals />
      )}
    </div>
  );
};

export default Dashboard;