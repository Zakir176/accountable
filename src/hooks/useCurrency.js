// src/hooks/useCurrency.js
import { useApp } from '../context/AppContext';

export const useCurrency = () => {
  const { currency, exchangeRates } = useApp();

  const formatAmount = (amount, targetCurrency = currency) => {
    const rate = exchangeRates[targetCurrency] || 1;
    const converted = amount * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(converted);
  };

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    const fromRate = exchangeRates[fromCurrency] || 1;
    const toRate = exchangeRates[toCurrency] || 1;
    return (amount / fromRate) * toRate;
  };

  return {
    currency,
    formatAmount,
    convertAmount
  };
};