'use client';

import { ReactNode, useEffect } from 'react';
import Lenis from 'lenis';

interface LenisProviderProps {
  children: ReactNode;
}

const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
