'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import AccountPage from '../components/dashboard/AccountPage';
import GPUTestPage from '../components/dashboard/GPUTestPage';
import { Menu } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export type DashboardPageType = 'dashboard' | 'account' | 'gpu-test';

const DashboardPage: React.FC = () => {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [activePage, setActivePage] = useState<DashboardPageType>('dashboard');
  const [displayedPage, setDisplayedPage] = useState<DashboardPageType>(activePage);
  const [animationClass, setAnimationClass] = useState('opacity-100');
  const animationRef = useRef(animationClass);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/');
    }
  }, [session, loading, router]);

useEffect(() => {
  if (activePage !== displayedPage) {
    animationRef.current = 'opacity-0';
    setAnimationClass(animationRef.current);
    const timer = setTimeout(() => {
      setDisplayedPage(activePage);
      animationRef.current = 'opacity-100';
      setAnimationClass(animationRef.current);
    }, 200); // Corresponds to transition duration

    return () => clearTimeout(timer);
  }
}, [activePage, displayedPage]);

  const handleNavigate = (page: DashboardPageType) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (displayedPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'account':
        return <AccountPage />;
      case 'gpu-test':
        return <GPUTestPage />;
      default:
        return <DashboardHome />;
    }
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E1A]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-[#0A0E1A]">
      <div className="container mx-auto flex min-h-screen">
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen} 
        />
        <div className="flex-1 flex flex-col">
          {/* Mobile Top Bar */}
          <header className="md:hidden flex items-center justify-between p-4 mt-20 bg-[#101421] border-b border-white/5 sticky top-0 z-10">
            <div />
            <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
              <Menu className="h-6 w-6 text-white" />
            </button>
          </header>
          
          <main className="flex-1 p-4 mt-16 sm:p-8 overflow-y-auto">
            <div className={`transition-opacity duration-200 ease-in-out ${animationClass}`}>
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
