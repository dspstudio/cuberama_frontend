import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthUIContextType {
  isAuthPopoverOpen: boolean;
  openAuthPopover: () => void;
  closeAuthPopover: () => void;
  toggleAuthPopover: () => void;
}

const AuthUIContext = createContext<AuthUIContextType | undefined>(undefined);

export const AuthUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthPopoverOpen, setAuthPopoverOpen] = useState(false);

  const openAuthPopover = () => setAuthPopoverOpen(true);
  const closeAuthPopover = () => setAuthPopoverOpen(false);
  const toggleAuthPopover = () => setAuthPopoverOpen(prev => !prev);

  const value = {
    isAuthPopoverOpen,
    openAuthPopover,
    closeAuthPopover,
    toggleAuthPopover,
  };

  return <AuthUIContext.Provider value={value}>{children}</AuthUIContext.Provider>;
};

export const useAuthUI = () => {
  const context = useContext(AuthUIContext);
  if (context === undefined) {
    throw new Error('useAuthUI must be used within an an AuthUIProvider');
  }
  return context;
};
