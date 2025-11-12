
import React from 'react';
import FadeInSection from './FadeInSection';
import { Upload, Sparkles, Film, Rocket } from 'lucide-react';
import Link from 'next/link';
import { cuberama3DAppLink } from '../constants';

interface StepProps {
    Icon: React.ElementType;
    step: number;
    title: string;
    description: string;
}

const WorkflowStep: React.FC<StepProps> = ({ Icon, step, title, description }) => (
    <FadeInSection>
        <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center bg-slate-800 border border-white/10 rounded-xl">
                <Icon className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
                <span className="text-cyan-400">Step {step}:</span> {title}
            </h3>
            <p className="mt-2 text-gray-400">{description}</p>
        </div>
    </FadeInSection>
);

const Workflow: React.FC = () => {
    return (
        <section id="how-it-works" className="relative py-20 sm:py-32 bg-slate-950/70">
            <div className="absolute inset-0 hero-background opacity-50"></div>
            <div className="container mx-auto px-6">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">How It Works</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Creating stunning 3D animations is a simple, three-step process designed for speed and creativity.
                        </p>
                    </div>
                </FadeInSection>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <WorkflowStep
                        Icon={Upload}
                        step={1}
                        title="Import"
                        description="Drag & drop your media, or record your screen and camera directly in the app. No setup required."
                    />
                    <WorkflowStep
                        Icon={Sparkles}
                        step={2}
                        title="Animate & Style"
                        description="Use the AI Generator for instant results or the Timeline Panel for manual control. Apply materials, lighting, and effects."
                    />
                    <WorkflowStep
                        Icon={Film}
                        step={3}
                        title="Export"
                        description="Share your work anywhere. Export high-quality videos (MP4/WebM), animated GIFs, or high-resolution images."
                    />
                </div>
            </div>
            <FadeInSection>
                <div className="mt-20 flex justify-center">
                    <Link
                        href={cuberama3DAppLink}
                        target='_blank'
                        className="inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-700 to-cyan-800 rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-cyan-700 hover:shadow-cyan-500/40 transform transition-all duration-300"
                        >
                        <span>Launch Cuberama (It&apos;s Free)</span>
                        <Rocket className="h-5 w-5" />
                    </Link>
                </div>
            </FadeInSection>
        </section>
    );
};

export default Workflow;
