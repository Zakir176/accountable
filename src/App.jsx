// src/App.jsx - UPDATED
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PieChart, Settings, Home, Menu, X } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import SettingsPage from './components/SettingsPage';
import Notifications from './components/Notifications';
import ThemeToggle from './components/ThemeToggle';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          onAddExpense={() => setIsFormOpen(true)}
          onViewAnalytics={() => setActiveTab('analytics')}
          onOpenSettings={() => setActiveTab('settings')}
        />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard 
          onAddExpense={() => setIsFormOpen(true)}
          onViewAnalytics={() => setActiveTab('analytics')}
          onOpenSettings={() => setActiveTab('settings')}
        />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-futuristic-gradient relative overflow-hidden theme-transition">
      {/* Desktop Sidebar */}
      <motion.nav 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:flex fixed left-0 top-0 h-full w-80 glass-dark border-r border-border-color z-30 flex-col"
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border-color">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-glow mb-2 text-primary">Accountable</h1>
            <p className="text-secondary text-sm">Financial clarity redefined</p>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-futuristic transition-all ${
                activeTab === item.id
                  ? 'bg-accent-gradient text-white font-semibold shadow-lg'
                  : 'text-secondary hover:text-primary hover:bg-secondary'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-lg font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* User Area */}
        <div className="p-6 border-t border-border-color">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <div className="flex gap-2">
              <Notifications />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed top-0 left-0 right-0 glass-dark border-b border-border-color z-40"
      >
        <div className="flex items-center justify-between p-4">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-futuristic glass-button"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-secondary" />
            ) : (
              <Menu className="w-5 h-5 text-secondary" />
            )}
          </motion.button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h1 className="text-xl font-bold text-glow text-primary">Accountable</h1>
          </motion.div>

          {/* Header Actions */}
          <div className="flex gap-2">
            <Notifications />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border-color overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-futuristic transition-all ${
                      activeTab === item.id
                        ? 'bg-accent-gradient text-white font-semibold'
                        : 'text-secondary hover:text-primary hover:bg-secondary'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content Area */}
      <main className={`min-h-screen transition-all duration-300 ${
        isMobileMenuOpen ? 'blur-sm' : ''
      } lg:ml-80`}>
        <div className="pt-16 lg:pt-0 pb-24 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-border-color z-40">
        <div className="flex justify-around items-center p-3">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-futuristic transition-all min-w-0 flex-1 mx-1 ${
                activeTab === item.id
                  ? 'bg-accent-gradient text-white'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Floating Action Button - Mobile Only */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsFormOpen(true)}
        className="lg:hidden fixed bottom-28 right-6 z-50 bg-accent-gradient p-5 rounded-full shadow-futuristic-hover neon-glow"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Desktop Add Button - In Sidebar */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(true)}
        className="hidden lg:flex fixed bottom-6 left-6 right-6 mx-auto w-48 bg-accent-gradient p-4 rounded-futuristic shadow-futuristic-hover neon-glow items-center gap-3 justify-center z-30"
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="font-semibold text-white">Add Expense</span>
      </motion.button>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ExpenseForm onClose={() => setIsFormOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;