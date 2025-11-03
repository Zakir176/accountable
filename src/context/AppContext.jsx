import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  expenses: [],
  categories: [
    { id: '1', name: 'Food', color: '#00D1FF', icon: '🍕' },
    { id: '2', name: 'Transport', color: '#39FF14', icon: '🚗' },
    { id: '3', name: 'Entertainment', color: '#8E44AD', icon: '🎬' },
    { id: '4', name: 'Shopping', color: '#FF4500', icon: '🛍️' },
    { id: '5', name: 'Bills', color: '#BDC3C7', icon: '📄' },
    { id: '6', name: 'Healthcare', color: '#FF6B6B', icon: '🏥' },
    { id: '7', name: 'Income', color: '#39FF14', icon: '💰' }
  ],
  budgets: {
    monthly: 1200,
    yearly: 14400
  },
  theme: 'dark',          // Dark or light mode
  currency: 'USD',        // Default currency
  exchangeRates: {}       // Exchange rates
};

// Action types
const actionTypes = {
  ADD_EXPENSE: 'ADD_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  LOAD_DATA: 'LOAD_DATA',
  SET_THEME: 'SET_THEME',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_EXCHANGE_RATES: 'SET_EXCHANGE_RATES'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };

    case actionTypes.DELETE_EXPENSE:
      return { ...state, expenses: state.expenses.filter(exp => exp.id !== action.payload) };

    case actionTypes.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(exp => (exp.id === action.payload.id ? action.payload : exp))
      };

    case actionTypes.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };

    case actionTypes.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
        expenses: state.expenses.map(exp =>
          exp.categoryId === action.payload ? { ...exp, categoryId: '1' } : exp
        )
      };

    case actionTypes.UPDATE_BUDGET:
      return { ...state, budgets: { ...state.budgets, ...action.payload } };

    case actionTypes.LOAD_DATA:
      return { ...state, ...action.payload };

    case actionTypes.SET_THEME:
      return { ...state, theme: action.payload };

    case actionTypes.SET_CURRENCY:
      return { ...state, currency: action.payload };

    case actionTypes.SET_EXCHANGE_RATES:
      return { ...state, exchangeRates: action.payload };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('accountable-data');
    if (savedData) {
      dispatch({ type: actionTypes.LOAD_DATA, payload: JSON.parse(savedData) });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('accountable-data', JSON.stringify(state));
  }, [state]);

  // Actions
  const addExpense = expense => {
    const newExpense = { ...expense, id: Date.now().toString(), createdAt: new Date().toISOString() };
    dispatch({ type: actionTypes.ADD_EXPENSE, payload: newExpense });
  };

  const deleteExpense = id => dispatch({ type: actionTypes.DELETE_EXPENSE, payload: id });

  const updateExpense = expense => dispatch({ type: actionTypes.UPDATE_EXPENSE, payload: expense });

  const addCategory = category => {
    const newCategory = { ...category, id: Date.now().toString() };
    dispatch({ type: actionTypes.ADD_CATEGORY, payload: newCategory });
  };

  const deleteCategory = id => dispatch({ type: actionTypes.DELETE_CATEGORY, payload: id });

  const updateBudget = budgets => dispatch({ type: actionTypes.UPDATE_BUDGET, payload: budgets });

  const setTheme = theme => dispatch({ type: actionTypes.SET_THEME, payload: theme });

  const setCurrency = currency => dispatch({ type: actionTypes.SET_CURRENCY, payload: currency });

  const setExchangeRates = rates => dispatch({ type: actionTypes.SET_EXCHANGE_RATES, payload: rates });

  // Calculate totals
  const getTotals = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = state.expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear && exp.type !== 'income';
    });

    const monthlyIncome = state.expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear && exp.type === 'income';
    });

    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = monthlyIncome.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalIncome,
      balance,
      monthlyBudget: state.budgets.monthly,
      budgetRemaining: state.budgets.monthly - totalExpenses
    };
  };

  const value = {
    ...state,
    addExpense,
    deleteExpense,
    updateExpense,
    addCategory,
    deleteCategory,
    updateBudget,
    setTheme,
    setCurrency,
    setExchangeRates,
    getTotals
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
