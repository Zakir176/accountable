// src/context/CurrencyContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// src/context/CurrencyContext.jsx
// Add ZAR and ZMW to the CURRENCIES object
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  ZMW: { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha', locale: 'en-ZM' }
};

// Add default exchange rates for ZAR and ZMW
const DEFAULT_EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  CAD: 1.25,
  AUD: 1.35,
  INR: 74.5,
  CNY: 6.45,
  ZAR: 18.0,  // Example rate: 1 USD = 18 ZAR
  ZMW: 22.0   // Example rate: 1 USD = 22 ZMW
};


export const CurrencyProvider = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('accountable-currency');
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setBaseCurrency(savedCurrency);
    }
  }, []);

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem('accountable-currency', baseCurrency);
  }, [baseCurrency]);

  // Function to fetch live exchange rates (mock implementation)
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // In a real app, you would call an API like:
      // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      // const data = await response.json();
      
      // For now, we'll use mock data with some random variation
      const mockRates = { ...DEFAULT_EXCHANGE_RATES };
      Object.keys(mockRates).forEach(currency => {
        if (currency !== baseCurrency) {
          // Add some random variation to simulate live data
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          mockRates[currency] = DEFAULT_EXCHANGE_RATES[currency] * (1 + variation);
        }
      });
      mockRates[baseCurrency] = 1;
      
      setExchangeRates(mockRates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Refresh rates periodically and on base currency change
  useEffect(() => {
    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [baseCurrency]);

  // Format amount in selected currency
  const formatAmount = (amount, currencyCode = baseCurrency) => {
    const currency = CURRENCIES[currencyCode];
    if (!currency) return `$${amount.toFixed(2)}`;

    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Convert amount from one currency to another
  const convertAmount = (amount, fromCurrency, toCurrency = baseCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    const amountInUSD = amount / exchangeRates[fromCurrency];
    return amountInUSD * exchangeRates[toCurrency];
  };

  // Get symbol for currency
  const getCurrencySymbol = (currencyCode = baseCurrency) => {
    return CURRENCIES[currencyCode]?.symbol || '$';
  };

  const value = {
    baseCurrency,
    setBaseCurrency,
    currencies: CURRENCIES,
    exchangeRates,
    isLoadingRates,
    formatAmount,
    convertAmount,
    getCurrencySymbol,
    refreshRates: fetchExchangeRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};