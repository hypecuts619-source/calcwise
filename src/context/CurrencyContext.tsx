import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '₹', code: 'INR' },
  { symbol: '¥', code: 'JPY' },
  { symbol: 'A$', code: 'AUD' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'S$', code: 'SGD' },
];

interface CurrencyContextType {
  symbol: string;
  code: string;
  setCurrency: (symbol: string, code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState({ symbol: '$', code: 'USD' });

  useEffect(() => {
    const saved = localStorage.getItem('calcwise-currency');
    if (saved) {
      setCurrencyState(JSON.parse(saved));
    }
  }, []);

  const setCurrency = (symbol: string, code: string) => {
    const newCurrency = { symbol, code };
    setCurrencyState(newCurrency);
    localStorage.setItem('calcwise-currency', JSON.stringify(newCurrency));
  };

  return (
    <CurrencyContext.Provider value={{ ...currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
