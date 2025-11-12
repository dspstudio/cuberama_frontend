import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Currency = 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD'); // Default to USD
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('cuberama_currency') as Currency | null;
    if (savedCurrency) {
      setCurrency(savedCurrency);
      setLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        const apiUrl = 'http://ip-api.com/json/';
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        if (data.status === 'success' && data.countryCode) {
          const isEuropean = !['US'].includes(data.countryCode);
          const determinedCurrency = isEuropean ? 'EUR' : 'USD';
          setCurrency(determinedCurrency);
          localStorage.setItem('cuberama_currency', determinedCurrency);
        }
      } catch (error) {
        console.error("Currency detection failed:", error);
        // Silently fail and stick with the default USD
        setCurrency('USD');
        localStorage.setItem('cuberama_currency', 'USD');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('cuberama_currency', newCurrency);
  };

  const value = {
    currency,
    setCurrency: handleSetCurrency,
    loading,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};