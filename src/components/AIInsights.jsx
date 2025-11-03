import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AIInsights = () => {
  const { expenses, categories, getTotals } = useApp();
  const [insights, setInsights] = useState([]);

  const analyzedData = useMemo(() => {
    if (expenses.length === 0) return {};

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth &&
             expDate.getFullYear() === currentYear &&
             exp.type === 'expense';
    });

    const categorySpending = categories.map(category => {
      const categoryExpenses = monthlyExpenses.filter(exp => exp.categoryId === category.id);
      const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const avgPerTransaction = categoryExpenses.length > 0 ? total / categoryExpenses.length : 0;

      return {
        ...category,
        total,
        transactionCount: categoryExpenses.length,
        average: avgPerTransaction
      };
    }).filter(cat => cat.total > 0);

    const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dailyAverage = totalSpent / new Date().getDate();

    const newInsights = [];

    // High spending categories
    const highSpending = categorySpending.filter(cat => cat.total > 300);
    highSpending.forEach(cat => {
      newInsights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Spending Alert',
        message: `You've spent $${cat.total.toFixed(2)} on ${cat.name} this month`,
        suggestion: 'Consider setting a budget limit for this category',
        severity: 'high'
      });
    });

    // Spending trends
    if (dailyAverage > 50) {
      newInsights.push({
        type: 'info',
        icon: TrendingUp,
        title: 'Spending Pace',
        message: `You're averaging $${dailyAverage.toFixed(2)} per day`,
        suggestion: 'At this rate, you might exceed your monthly budget',
        severity: 'medium'
      });
    }

    // Savings opportunity
    const lowCategories = categorySpending.filter(cat => cat.average > 0 && cat.average < 20);
    if (lowCategories.length > 0) {
      newInsights.push({
        type: 'success',
        icon: Lightbulb,
        title: 'Savings Opportunity',
        message: `You're spending wisely in ${lowCategories.length} categories`,
        suggestion: 'Maintain this disciplined spending pattern',
        severity: 'low'
      });
    }

    // Large transactions
    const largeTransactions = monthlyExpenses.filter(exp => exp.amount > 200);
    if (largeTransactions.length > 0) {
      newInsights.push({
        type: 'warning',
        icon: Zap,
        title: 'Large Transactions',
        message: `You have ${largeTransactions.length} transactions over $200 this month`,
        suggestion: 'Review these expenses to ensure they align with your goals',
        severity: 'medium'
      });
    }

    return {
      categorySpending,
      totalSpent,
      dailyAverage,
      insights: newInsights,
      transactionCount: monthlyExpenses.length
    };
  }, [expenses, categories]);

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'border-warning bg-[#FF4500]/10';
      case 'success': return 'border-success bg-[#39FF14]/10';
      default: return 'border-accent bg-[#00D1FF]/10';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-accent';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-futuristic p-4 sm:p-6 w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-[#00D1FF] rounded-full">
          <Brain className="w-6 h-6 text-[#1A1A1A]" />
        </div>
        <div>
          <h2 className="heading-2">AI Insights</h2>
          <p className="body-text-light text-sm sm:text-base">
            Smart analysis of your spending patterns
          </p>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
        <div className="bg-[#2C3E50] rounded-futuristic p-3 sm:p-4 text-center w-full">
          <p className="body-text-light text-xs sm:text-sm">Total Analyzed</p>
          <p className="text-accent text-lg sm:text-xl font-bold">
            ${analyzedData.totalSpent?.toFixed(2) || '0'}
          </p>
        </div>
        <div className="bg-[#2C3E50] rounded-futuristic p-3 sm:p-4 text-center w-full">
          <p className="body-text-light text-xs sm:text-sm">Transactions</p>
          <p className="text-accent text-lg sm:text-xl font-bold">
            {analyzedData.transactionCount || 0}
          </p>
        </div>
        <div className="bg-[#2C3E50] rounded-futuristic p-3 sm:p-4 text-center w-full">
          <p className="body-text-light text-xs sm:text-sm">Daily Average</p>
          <p className="text-accent text-lg sm:text-xl font-bold">
            ${analyzedData.dailyAverage?.toFixed(2) || '0'}
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {analyzedData.insights?.length > 0 ? (
          analyzedData.insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 sm:p-4 rounded-futuristic border-l-4 w-full ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconColor(insight.type)}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="body-text font-semibold mb-1 text-sm sm:text-base">{insight.title}</h3>
                    <p className="body-text-light text-xs sm:text-sm mb-1">{insight.message}</p>
                    <p className="body-text text-xs sm:text-sm text-accent">{insight.suggestion}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                    insight.severity === 'high' ? 'bg-warning' :
                    insight.severity === 'medium' ? 'bg-accent' : 'bg-success'
                  }`} />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6 sm:py-8 w-full">
            <Brain className="w-12 h-12 text-[#BDC3C7] mx-auto mb-3" />
            <p className="body-text-light text-sm sm:text-base">No insights yet</p>
            <p className="body-text-light text-xs sm:text-sm">Add more expenses to get AI-powered insights</p>
          </div>
        )}
      </div>

      {/* Spending by Category */}
      {analyzedData.categorySpending?.length > 0 && (
        <div className="mt-6 w-full">
          <h3 className="heading-3 mb-4 text-sm sm:text-base">Spending by Category</h3>
          <div className="space-y-3 sm:space-y-4">
            {analyzedData.categorySpending
              .sort((a, b) => b.total - a.total)
              .map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#2C3E50] rounded-futuristic hover:bg-[#34495E] transition-all w-full"
                >
                  <div className="flex items-center gap-3 mb-1 sm:mb-0">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="body-text font-medium text-sm sm:text-base">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="body-text font-semibold text-sm sm:text-base">${category.total.toFixed(2)}</p>
                    <p className="body-text-light text-xs sm:text-sm">{category.transactionCount} transactions</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIInsights;
