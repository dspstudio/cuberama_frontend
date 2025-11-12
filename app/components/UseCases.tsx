

import React, { useState } from 'react';
import FadeInSection from './FadeInSection';
import { Share2, Package, Palette, CheckCircle2, Heart, MessageCircle, Send } from 'lucide-react';

const useCaseData = [
  {
    id: 'social-media',
    Icon: Share2,
    title: 'For Social Media',
    description: 'Stop the scroll with eye-catching 3D animations that boost engagement. Create stunning reels, posts, stories, and ads in minutes, perfectly formatted for any platform.',
    features: [
      'Pre-set aspect ratios (16:9, 9:16, 1:1, 4:3, 16:10)',
      'One-click export to video or GIF',
      'AI generation for quick content ideas',
      'Templates for popular social media trends',
    ],
    visual: (
      <div className="w-full h-full bg-slate-900/50 p-2 rounded-lg flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Back: 16:9 Landscape Video */}
          <div
            className="absolute aspect-video w-[85%] bg-black/40 rounded-xl border border-white/10 p-2 flex flex-col gap-2"
            style={{ transform: 'rotateZ(-8deg) rotateX(10deg) translateY(-20%) scale(0.9)', opacity: 0.6 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-md opacity-80"></div>
          </div>
          {/* Middle: 1:1 Square Post */}
          <div
            className="absolute aspect-square h-[60%] bg-black/40 rounded-xl border border-white/10 p-2 flex flex-col gap-2"
            style={{ transform: 'rotateZ(10deg) rotateX(-5deg) translateX(35%) translateY(10%) scale(0.95)', opacity: 0.8 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-400 rounded-md opacity-80"></div>
          </div>
          {/* Front: 9:16 Portrait Reel */}
          <div className="relative aspect-[9/16] h-[90%] bg-black/50 rounded-xl border-2 border-white/10 flex flex-col p-2 gap-2 shadow-2xl shadow-blue-500/20" style={{ transform: 'translateZ(50px)' }}>
              <div className="w-full h-1/3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-sm animate-pulse"></div>
              <div className="w-full h-2/3 bg-black/40 rounded-sm"></div>
              
              {/* UI overlays to make it look like a reel */}
              <div className="absolute bottom-4 left-4 right-12 text-white text-xs">
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-500 rounded-full"></div>
                      <div className="font-bold">cuberama_ai</div>
                  </div>
                  <p className="mt-1 truncate">Check out this awesome animation! #3d #ai</p>
              </div>
              
              <div className="absolute right-2.5 bottom-6 flex flex-col gap-4 items-center text-white">
                  <div className="flex flex-col items-center gap-1">
                      <Heart size={24} fill="white" strokeWidth={1} />
                      <span className="text-xs font-semibold">12k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <MessageCircle size={24} />
                      <span className="text-xs font-semibold">1.1k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                      <Send size={24} />
                      <span className="text-xs font-semibold">456</span>
                  </div>
              </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'product-viz',
    Icon: Package,
    title: 'For Products & Brands',
    description: 'Showcase your products like never before. Transform static product shots into dynamic 3D presentations that highlight features and captivate customers.',
    features: [
      'Import your own images or media',
      'Realistic material and lighting presets',
      'Create 360° product spins and reveals',
      'Embeddable on any website or e-commerce store',
    ],
    visual: (
       <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex items-center justify-center">
         <div className="w-40 h-40 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg shadow-lg border border-white/10 flex items-center justify-center">
            <div className="w-24 h-32 bg-slate-600 rounded-md transform -rotate-12 animate-pulse"></div>
         </div>
       </div>
    ),
  },
  {
    id: 'digital-art',
    Icon: Palette,
    title: 'For Digital Art',
    description: "Craft unique digital art, collectibles, and mesmerizing looping animations. Cuberama provides the tools to turn your imagination into stunning 3D masterpieces for your portfolio or the next big NFT drop.",
     features: [
      'Create abstract scenes and generative art',
      'Export seamless loops for GIFs and videos',
      'Apply unique iridescent and glass materials',
      'High-resolution exports for minting and printing',
    ],
    visual: (
      <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="relative w-48 h-48">
          {/* Floating sphere */}
          <div
            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 top-4 left-4 shadow-2xl shadow-purple-500/30"
            style={{ transform: 'translateZ(40px)' }}
          ></div>
          {/* Floating cube */}
          <div
            className="absolute w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 bottom-4 right-4 shadow-2xl shadow-cyan-500/30"
            style={{ transform: 'rotateX(45deg) rotateY(-45deg) translateZ(-20px)' }}
          ></div>
           {/* Small background sphere */}
          <div
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 top-8 right-8 opacity-70"
            style={{ transform: 'translateZ(-50px)' }}
          ></div>
        </div>
      </div>
    ),
  },
];

const UseCases: React.FC = () => {
    const [activeTab, setActiveTab] = useState(useCaseData[0].id);

    const activeUseCase = useCaseData.find(f => f.id === activeTab);

    return (
        <section id="use-cases" className="py-20 sm:py-32 bg-slate-950/70 relative overflow-hidden">
             <div className="absolute inset-0 hero-background opacity-50"></div>
            <div className="container mx-auto px-6 relative z-10">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">For Every Creator, For Every Story</h2>
                        <p className="mt-4 text-lg text-gray-400">
                           Discover how Cuberama empowers creators to produce stunning content for any purpose, from viral social posts to polished product showcases.
                        </p>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="mt-16 max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-2 bg-slate-900/50 border border-white/10 rounded-xl mb-8">
                            {useCaseData.map(({ id, Icon, title }) => (
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

                        {activeUseCase && (
                             <div 
                                key={activeUseCase.id}
                                id={`tabpanel-${activeUseCase.id}`}
                                role="tabpanel"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in"
                            >
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white mb-4">{activeUseCase.title}</h3>
                                    <p className="text-gray-300 mb-6">{activeUseCase.description}</p>
                                    <ul className="space-y-3">
                                        {activeUseCase.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-gray-300">
                                                <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aspect-video bg-black/30 border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/10">
                                    {activeUseCase.visual}
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

export default UseCases;