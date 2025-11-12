import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ContactModalContextType {
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const ContactModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  const value = {
    isContactModalOpen,
    openContactModal,
    closeContactModal,
  };

  return <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>;
};

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
};
