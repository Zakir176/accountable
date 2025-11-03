import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ExpenseList from './ExpenseList';
import SearchFilter from './SearchFilter';
import FinancialGoals from './FinancialGoals';
import QuickActions from './QuickActions';
import AIInsights from './AIInsights';

const Dashboard = ({ onAddExpense, onViewAnalytics, onOpenSettings }) => {
  const { getTotals, expenses } = useApp();
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState('overview');
  const totals = getTotals();

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
    <div className="min-h-screen w-full">
      {/* Mobile Layout */}
      <div className="block lg:hidden w-full">
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 w-full">
          {/* View Toggle - Fixed for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-futuristic p-3 sm:p-4 w-full"
          >
            <div className="flex space-x-1 sm:space-x-2 w-full">
              {['overview', 'goals', 'insights'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-futuristic transition-all capitalize text-xs sm:text-sm ${
                    activeView === view
                      ? 'bg-[#00D1FF] text-[#1A1A1A] font-semibold'
                      : 'text-[#BDC3C7] hover:text-[#ECF0F1] hover:bg-[#34495E]'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions - Responsive grid */}
          {activeView === 'overview' && (
            <div className="w-full">
              <QuickActions
                onAddExpense={onAddExpense}
                onViewGoals={() => setActiveView('goals')}
                onViewAnalytics={onViewAnalytics}
                onExportData={() => onOpenSettings()}
                onOpenSettings={onOpenSettings}
              />
            </div>
          )}

          {/* Content based on active view */}
          {activeView === 'overview' ? (
            <div className="space-y-6 sm:space-y-8 w-full">
              {/* Financial Overview Cards - Responsive grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-futuristic p-3 sm:p-4 w-full min-w-0"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="min-w-0 flex-1">
                        <p className="body-text-light text-xs sm:text-sm truncate">{card.label}</p>
                        <p className={`text-lg sm:text-xl font-bold mt-1 sm:mt-2 truncate ${card.color}`}>
                          {card.value}
                        </p>
                      </div>
                      <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ml-2 ${card.color}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Search & Filter - Full width */}
              <div className="w-full">
                <SearchFilter onFilterChange={setFilters} />
              </div>

              {/* Recent Expenses - Full width */}
              <div className="w-full">
                <ExpenseList expenses={filteredExpenses} />
              </div>
            </div>
          ) : activeView === 'goals' ? (
            <div className="w-full">
              <FinancialGoals />
            </div>
          ) : (
            <div className="w-full">
              <AIInsights />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Multi Column */}
      <div className="hidden lg:block w-full">
        <div className="p-6 xl:p-8 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:gap-6 w-full">
            
            {/* Left Column - Overview & Quick Actions */}
            <div className="xl:col-span-4 space-y-4 xl:space-y-6 w-full">
              {/* Welcome Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-futuristic p-4 xl:p-6 w-full"
              >
                <h1 className="text-2xl xl:text-3xl font-bold text-glow mb-2">Welcome Back</h1>
                <p className="body-text-light text-sm xl:text-base">Here's your financial overview</p>
              </motion.div>

              {/* Quick Actions */}
              <div className="w-full">
                <QuickActions
                  onAddExpense={onAddExpense}
                  onViewGoals={() => setActiveView('goals')}
                  onViewAnalytics={onViewAnalytics}
                  onExportData={() => onOpenSettings()}
                  onOpenSettings={onOpenSettings}
                />
              </div>

              {/* Financial Goals Preview */}
              <div className="w-full">
                <FinancialGoals />
              </div>
            </div>

            {/* Middle Column - Main Content */}
            <div className="xl:col-span-5 space-y-4 xl:space-y-6 w-full">
              {/* Financial Overview Cards */}
              <div className="grid grid-cols-2 gap-3 xl:gap-4 w-full">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-futuristic p-4 xl:p-6 w-full"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="min-w-0 flex-1">
                        <p className="body-text-light text-sm xl:text-base">{card.label}</p>
                        <p className={`text-xl xl:text-2xl font-bold mt-2 xl:mt-3 ${card.color}`}>
                          {card.value}
                        </p>
                      </div>
                      <card.icon className={`w-6 h-6 xl:w-8 xl:h-8 flex-shrink-0 ml-3 ${card.color}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Search & Recent Expenses */}
              <div className="space-y-4 xl:space-y-6 w-full">
                <div className="w-full">
                  <SearchFilter onFilterChange={setFilters} />
                </div>
                <div className="w-full">
                  <ExpenseList expenses={filteredExpenses} />
                </div>
              </div>
            </div>

            {/* Right Column - Insights & Analytics */}
            <div className="xl:col-span-3 space-y-4 xl:space-y-6 w-full">
              {/* AI Insights */}
              <div className="w-full">
                <AIInsights />
              </div>

              {/* Budget Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-futuristic p-4 xl:p-6 w-full"
              >
                <h3 className="heading-3 mb-3 xl:mb-4">Budget Progress</h3>
                <div className="space-y-3 xl:space-y-4">
                  <div className="w-full">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="body-text-light">Monthly Budget</span>
                      <span className="body-text">${totals.monthlyBudget.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-[#2C3E50] rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((totals.totalExpenses / totals.monthlyBudget) * 100, 100)}%` }}
                        transition={{ duration: 1 }}
                        className={`h-2 rounded-full ${
                          (totals.totalExpenses / totals.monthlyBudget) > 0.8 ? 'bg-warning' : 'bg-success'
                        }`}
                      />
                    </div>
                    <p className="text-right text-xs body-text-light mt-1">
                      {((totals.totalExpenses / totals.monthlyBudget) * 100).toFixed(1)}% used
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;