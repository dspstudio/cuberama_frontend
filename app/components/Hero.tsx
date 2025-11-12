
import React from 'react';
import FadeInSection from './FadeInSection';
import { CheckCircle2 } from 'lucide-react';
import HeroShaderBackground from './HeroShaderBackground';
import { SHADER_ENABLED, cuberama3DAppLink } from '../constants';
import Link from 'next/link';
import VideoSlider from './VideoSlider';

const Hero = () => {
  return (
    <section
      className="hero-background relative min-h-screen flex justify-center overflow-hidden pt-40"
    >
      {SHADER_ENABLED && <HeroShaderBackground />}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
      <div className="hero relative z-10 container mx-auto px-6 text-center">
        <FadeInSection>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Bring Your Media to Life in 3D
          </h1>
        </FadeInSection>
        
        <FadeInSection>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
            Transform images and videos into stunning 3D animations with AI speed and manual precision. All in your browser. No downloads required.
          </p>
        </FadeInSection>
        
        <FadeInSection>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>No Downloads Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Free to Get Started</span>
            </div>
          </div>
        </FadeInSection>

        <div className="relative z-10">
        <FadeInSection>
          <div className="mt-10">
            <Link 
              href={cuberama3DAppLink} 
              target='_blank'
              className="inline-block px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-700 transform transition-all duration-300"
            >
              Start Creating for Free
            </Link>
          </div>
        </FadeInSection>
          </div>

          <FadeInSection>
            <VideoSlider />
          </FadeInSection>
      </div>
    </section>
  );
};

export default Hero;
