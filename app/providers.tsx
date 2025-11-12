"use client";

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AuthUIProvider } from './contexts/AuthUIContext';
import { ContactModalProvider } from './contexts/ContactModalContext';
import { InfoModalProvider } from './contexts/InfoModalContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import SmoothScrollProvider from './providers/SmoothScrollProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthUIProvider>
        <ContactModalProvider>
          <InfoModalProvider>
            <CurrencyProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </CurrencyProvider>
          </InfoModalProvider>
        </ContactModalProvider>
      </AuthUIProvider>
    </AuthProvider>
  );
}
