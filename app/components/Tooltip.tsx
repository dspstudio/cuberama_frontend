import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'center' | 'start' | 'end';
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top', align = 'center' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const alignClasses = {
    center: 'left-1/2 -translate-x-1/2',
    start: 'left-0',
    end: 'right-0',
  };

  const getAlignmentClass = () => {
    if (position === 'top' || position === 'bottom') {
      return alignClasses[align];
    }
    return ''; // Alignment is not applied for left/right positions in this setup
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <div
        role="tooltip"
        className={`absolute z-50 w-max max-w-xs text-left font-normal px-3 py-1.5 text-xs text-white bg-slate-800 border border-white/10 rounded-md shadow-lg transition-opacity duration-300 ${positionClasses[position]} ${getAlignmentClass()} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;