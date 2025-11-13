import React, { useRef, useEffect, useState } from 'react';
import { UserCircle, Menu, X } from 'lucide-react';
import AuthPopover from './AuthPopover';
import AnimatedLogo from './AnimatedLogo';
import { useAuthUI } from '@/app/contexts/AuthUIContext';
import { useAuth } from '@/app/contexts/AuthContext';
import Tooltip from './Tooltip';
import Link from 'next/link'
import Image from 'next/image';
import { getAvatarUrl } from '@/app/lib/utils';

import { usePathname } from 'next/navigation';

import {
  cuberama3DAppLink
} from '@/app/constants';

interface HeaderProps {
  onLaunch: () => void;
}

const NavLinks: React.FC<{
  className?: string;
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  activeLink: string;
}> = ({ className, handleNavClick, activeLink }) => (
  <nav className={className}>
    <Link href="/#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className={`text-sm hover:text-white transition-colors ${activeLink === 'how-it-works' ? 'text-blue-500' : ''}`}>How It Works</Link>
    <Link href="/#features" onClick={(e) => handleNavClick(e, 'features')} className={`text-sm hover:text-white transition-colors ${activeLink === 'features' ? 'text-blue-500' : ''}`}>Features</Link>
    <Link href="/#tutorials" onClick={(e) => handleNavClick(e, 'tutorials')} className={`text-sm hover:text-white transition-colors ${activeLink === 'tutorials' ? 'text-blue-500' : ''}`}>Tutorials</Link>
    <Link href="/#use-cases" onClick={(e) => handleNavClick(e, 'use-cases')} className={`text-sm hover:text-white transition-colors ${activeLink === 'use-cases' ? 'text-blue-500' : ''}`}>Use Cases</Link>
    <Link href="/#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className={`text-sm hover:text-white transition-colors ${activeLink === 'pricing' ? 'text-blue-500' : ''}`}>Pricing</Link>
  </nav>
);

const Header: React.FC<HeaderProps> = ({ onLaunch }) => {
  const { isAuthPopoverOpen, toggleAuthPopover, closeAuthPopover } = useAuthUI();
  const { session, user } = useAuth();
  const authRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    observerRef.current = observer;

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setActiveLink(targetId);
    setIsMenuOpen(false);

    if (pathname === '/') {
      e.preventDefault();
      isScrollingRef.current = true;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
    // On other pages, let the Link component handle navigation.
  };

  const handleAuthPopoverToggle = () => {
    setIsMenuOpen(false);
    toggleAuthPopover();
  };

  useEffect(() => {
    // Only add listener if popover is open
    if (!isAuthPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        closeAuthPopover();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAuthPopoverOpen, closeAuthPopover]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userAvatarUrl = getAvatarUrl(user, 32);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center" aria-label="Go to Cuberama homepage">
            <AnimatedLogo size={40} />
          </Link>

          {/* Desktop Navigation & Controls */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks className="flex items-center gap-6" handleNavClick={handleNavClick} activeLink={activeLink} />
            {(
              <Link href={cuberama3DAppLink}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-700 transform transition-all duration-300"
              >
                Launch Cuberama
              </Link>
            )}

            {session && user ? (
              <Tooltip text="Go to Dashboard" position="bottom" align="end">
                <button
                  onClick={onLaunch}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                  aria-label="Go to dashboard"
                >
                  <Image unoptimized src={userAvatarUrl} alt="User Avatar" width={32} height={32} className="rounded-full" />
                </button>
              </Tooltip>
            ) : (
               <div className="relative" ref={authRef}>
                <Tooltip text="Login / Register" position="bottom" align="end">
                  <button
                    onClick={handleAuthPopoverToggle}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Account menu"
                    aria-expanded={isAuthPopoverOpen}
                    aria-haspopup="true"
                  >
                    <UserCircle className="h-8 w-8" />
                  </button>
                </Tooltip>
                {isAuthPopoverOpen && !session && (
                  <div className="absolute top-full right-0 mt-2">
                    <AuthPopover />
                  </div>
                )}
               </div>
            )}
          </div>

          {/* Mobile Menu Button & Auth Icon */}
          <div className="md:hidden flex items-center gap-4">
            {session && user ? (
                <Tooltip text="Go to Dashboard" position="bottom" align="end">
                  <button
                    onClick={onLaunch}
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Go to dashboard"
                  >
                    <Image unoptimized src={userAvatarUrl} alt="User Avatar" width={32} height={32} className="rounded-full" />
                  </button>
                </Tooltip>
              ) : (
                 <div className="relative">
                  <Tooltip text="Login / Register" position="bottom" align="end">
                    <button
                      onClick={handleAuthPopoverToggle}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Account menu"
                      aria-expanded={isAuthPopoverOpen}
                      aria-haspopup="true"
                    >
                      <UserCircle className="h-7 w-7" />
                    </button>
                  </Tooltip>
                 </div>
              )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="container mx-auto px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-white/10">
            <NavLinks className="flex flex-col items-start gap-4" handleNavClick={handleNavClick} activeLink={activeLink} />
             <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              {session ? (
                <div className="flex items-center gap-4">
                  <Image unoptimized src={userAvatarUrl} alt="User Avatar" width={32} height={32} className="rounded-full" />
                  <span className="text-sm font-medium text-white">{user?.email}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">Not logged in</div>
              )}
              {session ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLaunch();
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleAuthPopover();
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg"
                >
                  Launch Cuberama
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
