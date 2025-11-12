import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import Tooltip from './Tooltip';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain amount
  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip text="Back to Top" position="left">
        <button
          type="button"
          onClick={scrollToTop}
          className={`
            bg-gradient-to-r from-blue-700 to-cyan-800
            text-white rounded-full p-3 shadow-lg
            hover:scale-110 hover:from-blue-600 hover:to-cyan-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-cyan-500
            transition-all duration-300
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
          aria-label="Go to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </Tooltip>
    </div>
  );
};

export default BackToTopButton;
