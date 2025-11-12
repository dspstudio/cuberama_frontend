import React, { useState } from 'react';
import FadeInSection from './FadeInSection';
import { Sparkles, Spline, Layers, CheckCircle2 } from 'lucide-react';
import MaterialsCanvas from './MaterialsCanvas';
import AIGeneratorCanvas from './AIGeneratorCanvas';
import TimelineCanvas from './TimelineCanvas';

const featureData = [
  {
    id: 'ai-generator',
    Icon: Sparkles,
    title: 'AI Animation Generator',
    description: 'Go from a simple idea to a fully realized animation in seconds. Just describe what you want, and our AI assistant will build a complete cinematic timeline for you.',
    features: [
      'Natural language prompting',
      'Generates camera movements, object animations, and timing',
      'Perfect for brainstorming and rapid prototyping',
      'Cinematic presets and styles',
    ],
    visual: (
      <div className="w-full h-full bg-slate-900/50 p-4 rounded-lg flex flex-col gap-4">
        <div className="flex-grow bg-black/30 rounded-md border border-white/10 relative overflow-hidden">
           <AIGeneratorCanvas />
        </div>
        <div className="flex-shrink-0 relative">
          <input 
            type="text" 
            readOnly
            value="Perform a full 360-degree spin on the vertical axis"
            className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 pl-4 pr-12 text-sm text-slate-300 placeholder-slate-500 focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'timeline-editor',
    Icon: Spline,
    title: 'Professional Timeline Editor',
    description: 'Take complete control with a powerful, intuitive keyframe editor. Fine-tune every property, perfect your timing, and craft complex animation sequences with precision.',
    features: [
      'Animate any property: position, rotation, scale, color, and more',
      'Advanced easing curves (Ease-in, Ease-out, Bezier)',
      'Layer-based editing for complex scenes',
      'Intuitive controls for scrubbing, scaling, and managing keyframes',
    ],
    visual: (
      <TimelineCanvas />
    ),
  },
  {
    id: 'materials-lighting',
    Icon: Layers,
    title: 'Materials & Lighting',
    description: 'Achieve photorealistic or stylized looks with a suite of advanced rendering features. Apply physically-based materials and illuminate your scene with professional studio lighting.',
     features: [
      'PBR materials: Glass, Metallic, Iridescent, and more',
      'Image-based lighting with professional HDRI environments',
      'Customizable lighting setups with multiple light sources',
      'Full suite of post-processing effects like Bloom and Vignette',
    ],
    visual: (
      <MaterialsCanvas />
    ),
  },
];

const FeatureSpotlight: React.FC = () => {
    const [activeTab, setActiveTab] = useState(featureData[0].id);

    const activeFeature = featureData.find(f => f.id === activeTab);

    return (
        <section id="feature-spotlight" className="py-20 sm:py-32 bg-slate-950/70 relative overflow-hidden">
             <div className="absolute inset-0 hero-background opacity-50"></div>
            <div className="container mx-auto px-6 relative z-10">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">A New Dimension of Control</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Whether you&apos;re a seasoned professional or just starting, Cuberama provides the perfect tools to bring your creative vision to life with unprecedented ease and power.
                        </p>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="mt-16 max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 p-2 bg-slate-900/50 border border-white/10 rounded-xl mb-8">
                            {featureData.map(({ id, Icon, title }) => (
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

                        {activeFeature && (
                             <div 
                                key={activeFeature.id}
                                id={`tabpanel-${activeFeature.id}`}
                                role="tabpanel"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in"
                                style={{animation: 'fade-in 0.5s ease-out forwards'}}
                            >
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-white mb-4">{activeFeature.title}</h3>
                                    <p className="text-gray-300 mb-6">{activeFeature.description}</p>
                                    <ul className="space-y-3">
                                        {activeFeature.features.map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-gray-300">
                                                <CheckCircle2 className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="aspect-video bg-black/30 border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/10">
                                    {activeFeature.visual}
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

export default FeatureSpotlight;