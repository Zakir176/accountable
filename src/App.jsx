import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PieChart, Settings, Home } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import SettingsPage from './components/SettingsPage';

function AppContent() {
  // State variables
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Callback functions
  const handleAddExpense = () => setIsFormOpen(true);
  const handleViewGoals = () => setActiveTab('dashboard');
  const handleViewAnalytics = () => setActiveTab('analytics');
  const handleExportData = () => setActiveTab('settings');
  const handleOpenSettings = () => setActiveTab('settings');

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onAddExpense={handleAddExpense}
            onViewGoals={handleViewGoals}
            onViewAnalytics={handleViewAnalytics}
            onExportData={handleExportData}
            onOpenSettings={handleOpenSettings}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-futuristic-gradient relative overflow-hidden">
      {/* Main Content */}
      <main className="pb-24 relative z-10">
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
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAddExpense}
        className="fixed bottom-28 right-6 z-50 bg-accent-gradient p-5 rounded-full shadow-futuristic-hover neon-glow"
      >
        <Plus className="w-6 h-6 text-[#1A1A1A]" />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-futuristic border-t border-[#2C3E50] z-40">
        <div className="flex justify-around items-center p-4">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-3 rounded-futuristic transition-all ${
                activeTab === item.id
                  ? 'bg-[#00D1FF] text-[#1A1A1A]'
                  : 'text-[#BDC3C7] hover:text-[#ECF0F1]'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold font-poppins">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
