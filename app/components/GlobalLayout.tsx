"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {}, [router, pathname]);
  const handleLaunch = () => {
    router.push('/dashboard');
  };
  
  const isLoading = authLoading || pageLoading;

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-[#0A0E1A] bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <Header onLaunch={handleLaunch} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
