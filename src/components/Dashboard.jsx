// src/components/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import ExpenseList from './ExpenseList';
import SearchFilter from './SearchFilter';
import FinancialGoals from './FinancialGoals';
import QuickActions from './QuickActions';
import AIInsights from './AIInsights';
import CurrencySelector from './CurrencySelector';

const Dashboard = ({ onAddExpense, onViewAnalytics, onOpenSettings }) => {
  const { getTotals, expenses } = useApp();
  const { isDark } = useTheme();
  const { baseCurrency, formatAmount, isLoadingRates } = useCurrency();
  const [filters, setFilters] = useState({});
  const totals = getTotals();

  // Calculate converted totals (placeholder for actual conversions)
  const convertedTotals = useMemo(() => ({ ...totals }), [totals, baseCurrency]);

  const cards = [
    {
      label: 'Total Balance',
      value: formatAmount(convertedTotals.balance),
      icon: Wallet,
      color: convertedTotals.balance >= 0 ? 'text-success' : 'text-warning'
    },
    {
      label: 'This Month',
      value: formatAmount(convertedTotals.totalIncome),
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      label: 'Expenses',
      value: formatAmount(convertedTotals.totalExpenses),
      icon: TrendingDown,
      color: 'text-warning'
    },
    {
      label: 'Budget Left',
      value: formatAmount(convertedTotals.budgetRemaining),
      icon: Target,
      color: convertedTotals.budgetRemaining >= 0 ? 'text-success' : 'text-warning'
    }
  ];

  return (
    <div className="min-h-screen w-full theme-transition">
      {/* Mobile Layout */}
      <div className="block lg:hidden w-full">
        <div className="p-4 space-y-6">
          {/* Currency Header - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-futuristic p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                <div>
                  <span className="body-text font-semibold text-primary text-sm">
                    Base Currency
                  </span>
                  <p className="body-text-light text-xs">
                    All amounts in {baseCurrency}
                  </p>
                </div>
              </div>
              <CurrencySelector />
            </div>
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-futuristic p-4 flex flex-col items-start justify-between"
              >
                <div className="flex items-center gap-2">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                  <span className="body-text-light text-sm">{card.label}</span>
                </div>
                <p className="text-lg font-semibold text-primary">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <QuickActions
            onAddExpense={onAddExpense}
            onViewAnalytics={onViewAnalytics}
            onOpenSettings={onOpenSettings}
          />

          <SearchFilter filters={filters} setFilters={setFilters} />
          <ExpenseList expenses={expenses} filters={filters} />
          <FinancialGoals />
          <AIInsights />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full">
        <div className="p-6 xl:p-8 w-full max-w-7xl mx-auto space-y-8">
          {/* Currency Header - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-futuristic p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="body-text font-semibold text-primary text-lg">
                    Base Currency
                  </h2>
                  <p className="body-text-light">
                    All amounts displayed in {baseCurrency}
                  </p>
                </div>
              </div>
              <CurrencySelector />
            </div>
          </motion.div>

          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-futuristic p-6 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                  <span className="body-text-light">{card.label}</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{card.value}</p>
              </motion.div>
            ))}
          </div>

          <QuickActions
            onAddExpense={onAddExpense}
            onViewAnalytics={onViewAnalytics}
            onOpenSettings={onOpenSettings}
          />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <SearchFilter filters={filters} setFilters={setFilters} />
              <ExpenseList expenses={expenses} filters={filters} />
            </div>
            <div className="space-y-6">
              <FinancialGoals />
              <AIInsights />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
