import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getExchangeRates } from '../api/currency.js';

const CurrencyContext = createContext(null);
const DEFAULT_RATES = {
  USD: 1.0,
  EUR: 0.876,    
  GBP: 0.746,   
  INR: 96.3,    
  JPY: 162.2,    
  CAD: 1.405,   
  AUD: 1.43,     
};

const DEFAULT_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('metroscope_currency') || 'USD';
  });
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [symbols, setSymbols] = useState(DEFAULT_SYMBOLS);

  useEffect(() => {
    getExchangeRates()
      .then((res) => {
        if (res.data?.data) {
          setRates(res.data.data.rates || DEFAULT_RATES);
          setSymbols(res.data.data.symbols || DEFAULT_SYMBOLS);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch live exchange rates:', err);
      });
  }, []);

  const setCurrency = useCallback((curr) => {
    setCurrencyState(curr);
    localStorage.setItem('metroscope_currency', curr);
  }, []);

  const convert = useCallback((usdAmount) => {
    if (usdAmount == null || isNaN(usdAmount)) return 0;
    const rate = rates[currency] || 1.0;
    return Math.round(usdAmount * rate);
  }, [rates, currency]);

  const formatCurrency = useCallback((usdAmount, showSymbol = true) => {
    if (usdAmount == null) return '—';
    const converted = convert(usdAmount);
    const symbol = showSymbol ? (symbols[currency] || '$') : '';

    if (currency === 'JPY') {
      return `${symbol}${converted.toLocaleString()}`;
    }
    return `${symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }, [convert, currency, symbols]);

  const value = {
    currency,
    setCurrency,
    rates,
    symbols,
    convert,
    formatCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
