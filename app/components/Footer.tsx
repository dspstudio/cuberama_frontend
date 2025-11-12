import React from 'react';
import { useContactModal } from '@/app/contexts/ContactModalContext';
import { useInfoModal } from '@/app/contexts/InfoModalContext';

const Footer: React.FC = () => {
  const { openContactModal } = useContactModal();
  const { openInfoModal } = useInfoModal();
  return (
    <footer className="py-8 border-t border-white/10 hero-background">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Cuberama. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <button onClick={() => openInfoModal('about')} className="text-sm text-gray-400 hover:text-white transition-colors">About Us</button>
          <button onClick={() => openInfoModal('privacy')} className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
          <button onClick={() => openInfoModal('terms')} className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</button>
          <button onClick={() => openInfoModal('cookies')} className="text-sm text-gray-400 hover:text-white transition-colors">Cookie Policy</button>
          <button onClick={openContactModal} className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;