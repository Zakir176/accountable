import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Notifications = () => {
  const { expenses, getTotals, budgets } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkForNotifications();
  }, [expenses, budgets]);

  const checkForNotifications = () => {
    const totals = getTotals();
    const newNotifications = [];

    // Budget alerts
    const budgetUsage = (totals.totalExpenses / budgets.monthly) * 100;
    if (budgetUsage > 80 && budgetUsage <= 100) {
      newNotifications.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'Budget Alert',
        message: `You've used ${budgetUsage.toFixed(1)}% of your monthly budget`,
        timestamp: new Date().toISOString()
      });
    } else if (budgetUsage > 100) {
      newNotifications.push({
        id: 'budget-exceeded',
        type: 'error',
        title: 'Budget Exceeded',
        message: `You've exceeded your monthly budget by $${(totals.totalExpenses - budgets.monthly).toFixed(2)}`,
        timestamp: new Date().toISOString()
      });
    }

    // Large expense alerts
    const largeExpenses = expenses.filter(expense => 
      expense.type === 'expense' && expense.amount > 500
    );
    largeExpenses.forEach(expense => {
      newNotifications.push({
        id: `large-expense-${expense.id}`,
        type: 'info',
        title: 'Large Expense',
        message: `You spent $${expense.amount} on ${expense.description}`,
        timestamp: expense.createdAt
      });
    });

    // Savings encouragement
    if (totals.balance > 1000) {
      newNotifications.push({
        id: 'savings-milestone',
        type: 'success',
        title: 'Savings Milestone!',
        message: `You've saved $${totals.balance.toFixed(2)} this month!`,
        timestamp: new Date().toISOString()
      });
    }

    setNotifications(newNotifications.slice(0, 5)); // Limit to 5 notifications
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'error': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-accent';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-futuristic glass-button"
      >
        <Bell className="w-5 h-5 text-[#BDC3C7] hover:text-[#ECF0F1]" />
        {notifications.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full"
          />
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-12 right-0 w-80 sm:w-96 glass-card rounded-futructive p-4 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#BDC3C7] hover:text-[#ECF0F1] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-[#2C3E50] rounded-futuristic border-l-4"
                        style={{ 
                          borderLeftColor: notification.type === 'warning' ? '#FF4500' : 
                                         notification.type === 'success' ? '#39FF14' : '#00D1FF'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getIconColor(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="body-text font-semibold text-sm">
                              {notification.title}
                            </p>
                            <p className="body-text-light text-xs mt-1">
                              {notification.message}
                            </p>
                            <p className="body-text-light text-xs mt-2">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="text-[#BDC3C7] hover:text-[#ECF0F1] p-1 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-[#BDC3C7] mx-auto mb-2" />
                    <p className="body-text-light text-sm">No notifications</p>
                    <p className="body-text-light text-xs">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Notifications;