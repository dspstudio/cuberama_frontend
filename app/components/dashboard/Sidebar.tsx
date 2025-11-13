import React, { useState } from 'react';
import { LayoutDashboard, User, LogOut, Sparkles, Cpu, X } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';
import Tooltip from '../Tooltip';
import ConfirmationModal from './ConfirmationModal';
import Link from 'next/link';

export type DashboardPageType = 'dashboard' | 'gpu-test' | 'account';
interface NavItemProps {
    Icon: React.ElementType;
    label: string;
    page: DashboardPageType;
    active: boolean;
    onClick: (page: DashboardPageType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ Icon, label, page, active, onClick }) => (
    <button onClick={() => onClick(page)} className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 w-full text-left ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
        <Icon className="h-5 w-5" />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

interface SidebarProps {
    activePage: DashboardPageType;
    onNavigate: (page: DashboardPageType) => void;
    
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, setIsOpen }) => {
    const { user, signOut } = useAuth();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    // Fallback if user is null for some reason
    const userEmail = user?.email || 'user@cuberama.com';
    const userName = user?.user_metadata?.nickname || user?.user_metadata?.full_name || userEmail.split('@')[0];
    const userAvatarUrl = user?.user_metadata?.avatar_url || `https://i.pravatar.cc/40?u=${user?.id || userEmail}`;

    const handleLogout = async () => {
        await signOut();
        setIsLogoutConfirmOpen(false);
        // The onAuthStateChange listener in AuthContext will handle redirecting.
    };

    const handleNavigate = (page: DashboardPageType) => {
        onNavigate(page);
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            <aside 
                className={`w-72 bg-[#101421] p-6 mt-24 rounded-t-xl flex flex-col border-r border-white/5 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close sidebar">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="bg-[#161A25] p-4 rounded-xl mb-8 border border-white/5 flex items-center gap-4">
                    <img src={userAvatarUrl} alt={userName} className="w-10 h-10 rounded-full" />
                    <div>
                        <h3 className="text-lg font-bold text-white">Welcome back,</h3>
                        <h3 className="text-lg font-bold text-white capitalize">{userName}!</h3>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem Icon={LayoutDashboard} label="Dashboard" page="dashboard" active={activePage === 'dashboard'} onClick={handleNavigate} />
                    <NavItem Icon={Cpu} label="GPU Test" page="gpu-test" active={activePage === 'gpu-test'} onClick={handleNavigate} />
                    <NavItem Icon={User} label="Account" page="account" active={activePage === 'account'} onClick={handleNavigate} />
                </nav>

                <div className="mt-auto">
                    <Tooltip text="Sign out of your account" position="right">
                         <button onClick={() => setIsLogoutConfirmOpen(true)} className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 w-full text-left text-gray-400 hover:bg-white/5 hover:text-white mb-4">
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </Tooltip>
                    <div>
                    <a
                      href="https://buy.stripe.com/test_6oU8wR5TwdmU0tf8FY33W01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-700 to-cyan-800 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                        <Sparkles className="h-5 w-5" />
                        <span>Activate Cuberama Pro</span>
                    </a>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">Unlock advanced features</p>
                </div>
            </aside>
            
            <ConfirmationModal
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                confirmText="Logout"
            >
                <p className="text-sm text-gray-400">
                    Are you sure you want to sign out of your account?
                </p>
            </ConfirmationModal>
        </>
    );
};

export default Sidebar;
