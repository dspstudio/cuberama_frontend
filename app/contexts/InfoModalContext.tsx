import React, { createContext, useState, useContext, ReactNode } from 'react';

export type InfoModalType = 'about' | 'terms' | 'cookies' | 'privacy' | null;

interface InfoModalContextType {
  activeModal: InfoModalType;
  openInfoModal: (modal: InfoModalType) => void;
  closeInfoModal: () => void;
}

const InfoModalContext = createContext<InfoModalContextType | undefined>(undefined);

export const InfoModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<InfoModalType>(null);

  const openInfoModal = (modal: InfoModalType) => setActiveModal(modal);
  const closeInfoModal = () => setActiveModal(null);

  const value = {
    activeModal,
    openInfoModal,
    closeInfoModal,
  };

  return <InfoModalContext.Provider value={value}>{children}</InfoModalContext.Provider>;
};

export const useInfoModal = () => {
  const context = useContext(InfoModalContext);
  if (context === undefined) {
    throw new Error('useInfoModal must be used within an InfoModalProvider');
  }
  return context;
};