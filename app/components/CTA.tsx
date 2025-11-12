import React from 'react';
import FadeInSection from './FadeInSection';
import { Rocket } from 'lucide-react';
import { useAuthUI } from '@/app/contexts/AuthUIContext';
import { useAuth } from '@/app/contexts/AuthContext';

interface CTAProps {
  onLaunch: () => void;
}

const CTA: React.FC<CTAProps> = ({ onLaunch }) => {
  const { openAuthPopover } = useAuthUI();
  const { session } = useAuth();

  const handleClick = session ? onLaunch : openAuthPopover;

  return (
    <section className="py-20 sm:py-32 bg-slate-950/70">
      <div className="container mx-auto px-6 text-center">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to Create?</h2>
        </FadeInSection>
        <FadeInSection>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Unleash your creativity and start building your first 3D animation today.
          </p>
        </FadeInSection>
        <FadeInSection>
          <div className="mt-10">
            <button
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-700 hover:shadow-cyan-500/40 transform transition-all duration-300"
            >
              <span>{session ? 'Go to Dashboard' : "Launch Cuberama (It's Free)"}</span>
              <Rocket className="h-5 w-5" />
            </button>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default CTA;