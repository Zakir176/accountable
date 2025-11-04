// src/components/CurrencySelector.jsx - FINAL Responsive Version
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, RefreshCw, Check, Globe, ChevronDown } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';

const CurrencySelector = () => {
  const { 
    baseCurrency, 
    setBaseCurrency, 
    currencies, 
    isLoadingRates, 
    refreshRates,
    exchangeRates 
  } = useCurrency();
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies[baseCurrency];

  const handleCurrencyChange = (currencyCode) => {
    setBaseCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-56 md:w-64 lg:w-72 xl:w-80">
      {/* Currency Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 rounded-futuristic bg-secondary hover:bg-[var(--border-color)] transition-all w-full"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-sm font-semibold text-primary truncate">
            {currentCurrency.code}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isLoadingRates && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-3 h-3 text-accent" />
            </motion.div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </motion.button>

      {/* Currency Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-0 sm:right-auto mt-0 sm:mt-2 w-[90vw] sm:w-full max-w-md sm:max-w-none transform -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 glass-card rounded-futuristic p-4 z-50 border border-border-color shadow-futuristic max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="text-sm font-semibold text-primary">Select Currency</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={refreshRates}
                    disabled={isLoadingRates}
                    className="p-1 rounded-lg hover:bg-secondary transition-colors"
                    title="Refresh exchange rates"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-accent ${isLoadingRates ? 'animate-spin' : ''}`}
                    />
                  </motion.button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-secondary transition-colors sm:hidden"
                  >
                    <Check className="w-4 h-4 text-accent" />
                  </button>
                </div>
              </div>

              {/* Currency List */}
              <div className="space-y-2 overflow-y-auto flex-1">
                {Object.values(currencies).map((currency) => (
                  <motion.button
                    key={currency.code}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCurrencyChange(currency.code)}
                    className={`w-full flex items-center justify-between p-3 rounded-futuristic transition-all ${
                      baseCurrency === currency.code
                        ? 'bg-accent-gradient text-white'
                        : 'bg-secondary hover:bg-[var(--border-color)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <div className="text-left min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">
                          {currency.code} - {currency.symbol}
                        </div>
                        <div
                          className={`text-xs truncate ${
                            baseCurrency === currency.code ? 'text-white/80' : 'text-secondary'
                          }`}
                        >
                          {currency.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {currency.code !== baseCurrency && (
                        <span
                          className={`text-xs hidden sm:block ${
                            baseCurrency === currency.code ? 'text-white/80' : 'text-secondary'
                          }`}
                        >
                          1 {baseCurrency} = {exchangeRates[currency.code]?.toFixed(4)} {currency.code}
                        </span>
                      )}
                      {baseCurrency === currency.code && (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Last Updated */}
              <div className="mt-3 pt-3 border-t border-border-color flex-shrink-0">
                <p className="text-xs text-secondary text-center">
                  Rates update every 5 minutes
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;
