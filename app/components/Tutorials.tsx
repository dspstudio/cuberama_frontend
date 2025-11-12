import React from 'react';
import Link from 'next/link';
import FadeInSection from './FadeInSection';
import { PlayCircle, Sparkles, Spline, Layers, Film, ArrowRight } from 'lucide-react';

const tutorialData = [
  {
    title: "Your First Animation with AI",
    description: "Learn how to go from a simple text prompt to a full animation in under 60 seconds.",
    Icon: Sparkles,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Mastering the Timeline",
    description: "Dive deep into the keyframe editor to gain precise control over your creations.",
    Icon: Spline,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Realistic Materials & Lighting",
    description: "Discover how to use PBR materials and HDRI lighting to achieve photorealistic results.",
    Icon: Layers,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Exporting for Social Media",
    description: "Master the export settings to get the perfect format and quality for any platform.",
    Icon: Film,
    gradient: "from-amber-500 to-orange-500",
  }
];

const TutorialCard: React.FC<typeof tutorialData[0]> = ({ title, description, Icon, gradient }) => (
  <FadeInSection>
    <a 
      href="#" 
      onClick={(e) => e.preventDefault()} 
      className={`group relative block aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${gradient} p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
      aria-label={`Watch tutorial: ${title}`}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="self-start">
          <div className="bg-black/30 p-2 rounded-full">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="text-left">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm text-white/80">{description}</p>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayCircle className="w-20 h-20 text-white/20 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110" />
      </div>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
    </a>
  </FadeInSection>
);

const Tutorials: React.FC = () => {
  return (
    <section id="tutorials" className="py-20 sm:py-32 bg-slate-950/70">
      <div className="container mx-auto px-6">
        <FadeInSection>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Master Cuberama in Minutes</h2>
                <p className="mt-4 text-lg text-gray-400">
                    Get up to speed quickly with our bite-sized video tutorials, designed to help you unlock the full power of the editor.
                </p>
            </div>
        </FadeInSection>

        <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {tutorialData.map(tutorial => (
            <TutorialCard key={tutorial.title} {...tutorial} />
          ))}
        </div>

        <FadeInSection>
          <div className="mt-16 text-center">
            <Link 
              href="/tutorials" 
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              View All Tutorials
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default Tutorials;
