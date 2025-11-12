import React, { useState } from 'react';
import FadeInSection from './FadeInSection';
import { Monitor, Image, Video, CheckCircle2, PlayCircle } from 'lucide-react';

const animateData = [
  {
    id: 'websites-showcase',
    Icon: Monitor,
    title: '3D Website Showcase',
    description: 'Bring your website designs to life. Animate screenshots and UI elements in a 3D space to create compelling demos and marketing videos.',
    features: [
      'Animate UI elements with depth and perspective',
      'Create scrolling animations and page transitions',
      'Place designs in 3D device mockups',
      'Perfect for portfolio and landing page videos',
    ],
    visual: (
      <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex items-center justify-center gap-8" style={{ perspective: '1000px' }}>
        <div className="w-48 h-32 bg-slate-800 border border-white/10 rounded-md p-2 flex flex-col gap-2">
            <div className="w-1/3 h-4 bg-cyan-400/50 rounded-sm"></div>
            <div className="w-full h-16 bg-slate-700/50 rounded-sm"></div>
            <div className="flex gap-2">
                <div className="w-1/2 h-6 bg-slate-600/50 rounded-sm"></div>
                <div className="w-1/2 h-6 bg-slate-600/50 rounded-sm"></div>
            </div>
        </div>
        <div className="text-slate-500 text-3xl font-thin">→</div>
        <div 
          className="w-48 h-32 bg-slate-800 border border-white/10 rounded-md p-2 flex flex-col gap-2 shadow-2xl shadow-blue-500/20"
          style={{ transform: 'rotateY(-30deg) rotateX(15deg) scale(1.1)' }}
        >
          <div className="w-1/3 h-4 bg-cyan-400 rounded-sm"></div>
          <div className="w-full h-16 bg-slate-700 rounded-sm"></div>
          <div className="flex gap-2">
              <div className="w-1/2 h-6 bg-slate-600 rounded-sm"></div>
              <div className="w-1/2 h-6 bg-slate-600 rounded-sm"></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'product-photos',
    Icon: Image,
    title: '3D Product Photos',
    description: 'Break free from boring, static product images. Create engaging 3D showcases that let customers see your product from every angle, highlighting its features and driving more sales.',
    features: [
      'Isolate products from backgrounds automatically',
      'Generate 3D models from 2D images',
      'Create 360° turntable animations',
      'Place products in virtual photo studios',
    ],
    visual: (
       <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex items-center justify-center gap-8">
        <div className="w-24 h-32 bg-slate-800 border border-white/10 rounded-md p-2 flex items-center justify-center">
            <div className="w-16 h-24 bg-gradient-to-t from-red-500 to-orange-400 rounded-sm"></div>
        </div>
        <div className="text-slate-500 text-3xl font-thin">→</div>
         <div 
          className="w-32 h-32 flex items-center justify-center"
          style={{ perspective: '800px' }}
        >
          <div 
            className="w-24 h-32 bg-gradient-to-t from-red-500 to-orange-400 rounded-md shadow-2xl"
            style={{ transform: 'rotateY(45deg) rotateX(10deg)'}}
          ></div>
        </div>
       </div>
    ),
  },
  {
    id: 'video-media',
    Icon: Video,
    title: '3D Video Media',
    description: 'Give your video clips a new dimension. Turn flat videos into 3D objects that can twist, turn, and fly through your scene, creating dynamic and engaging content.',
     features: [
      'Animate video clips on a 3D plane',
      'Control playback speed and looping',
      'Combine multiple video clips in a scene',
      'Apply materials and effects to video surfaces',
    ],
    visual: (
      <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex items-center justify-center gap-8" style={{ perspective: '1000px' }}>
        <div className="w-48 h-28 bg-slate-800 border border-white/10 rounded-md p-2 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/50" />
            </div>
        </div>
        <div className="text-slate-500 text-3xl font-thin">→</div>
        <div 
          className="w-48 h-28 bg-slate-800 border border-white/10 rounded-md p-2 shadow-2xl shadow-indigo-500/20"
          style={{ transform: 'rotateY(-40deg) rotateX(10deg) scale(1.1)' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-sm flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/50" />
          </div>
        </div>
      </div>
    ),
  },
];

const AnimateAnything: React.FC = () => {
    const [activeTab, setActiveTab] = useState(animateData[0].id);

    const activeItem = animateData.find(f => f.id === activeTab);

    return (
        <section id="animate-anything" className="py-20 sm:py-32 bg-slate-950/70 relative overflow-hidden">
             <div className="absolute inset-0 hero-background opacity-50"></div>
            <div className="container mx-auto px-6 relative z-10">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Animate Anything</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Cuberama is built for versatility. See how you can transform your existing assets—from logos to product photos—into captivating 3D animations.
                        </p>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="mt-16 max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-center gap-2 sm:gap-4 p-2 bg-slate-900/50 border border-white/10 rounded-xl mb-8">
                            {animateData.map(({ id, Icon, title }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full sm:w-auto flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === id ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    role="tab"
                                    aria-selected={activeTab === id}
                                    aria-controls={`tabpanel-${id}`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {title}
                                </button>
                            ))}
                        </div>

                        {activeItem && (
                             <div 
                                key={activeItem.id}
                                id={`tabpanel-${activeItem.id}`}
                                role="tabpanel"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in"
                                style={{animation: 'fade-in 0.5s ease-out forwards'}}
                            >
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white mb-4">{activeItem.title}</h3>
                                    <p className="text-gray-300 mb-6">{activeItem.description}</p>
                                    <ul className="space-y-3">
                                        {activeItem.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-gray-300">
                                                <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aspect-video bg-black/30 border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/10">
                                    {activeItem.visual}
                                </div>
                            </div>
                        )}
                    </div>
                </FadeInSection>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default AnimateAnything;