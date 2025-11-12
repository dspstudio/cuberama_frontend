import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cuberama_cookie_consent');
    if (!hasConsented) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // Delay to avoid being too intrusive on load
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem('cuberama_cookie_consent', 'true');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-hidden={!isVisible}
    >
      <div className="container mx-auto max-w-4xl px-6 py-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          <strong id="cookie-consent-title">We value your privacy.</strong> We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
        </p>
        <button
          onClick={handleAccept}
          className="px-6 py-2 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          aria-label="Accept and close cookie banner"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;