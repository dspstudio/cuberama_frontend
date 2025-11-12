import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 130 32" 
      className={className}
      aria-label="Cuberama logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 4)">
        {/* Cube Shape */}
        <polygon 
          points="12,1 23,7 23,19 12,25 1,19 1,7" 
          fill="rgba(59, 130, 246, 0.1)" 
          stroke="url(#logo-gradient)" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
        <line x1="1" y1="7" x2="12" y2="13" stroke="url(#logo-gradient)" strokeWidth="1" />
        <line x1="23" y1="7" x2="12" y2="13" stroke="url(#logo-gradient)" strokeWidth="1" />
        <line x1="12" y1="25" x2="12" y2="13" stroke="url(#logo-gradient)" strokeWidth="1" />
        
        {/* AI Sparkle */}
        <g transform="translate(12, 1)" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round">
          <line x1="0" y1="-3" x2="0" y2="1" />
          <line x1="-2" y1="-1" x2="2" y2="-1" />
        </g>
      </g>
      
      {/* Text */}
      <text 
        x="32" 
        y="21" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
        fontSize="16" 
        fontWeight="bold" 
        fill="white"
      >
        Cuberama
      </text>
    </svg>
  );
};

export default Logo;
