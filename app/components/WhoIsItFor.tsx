import React from 'react';
import FadeInSection from './FadeInSection';
import { PenTool, Share2, Users, Sparkles } from 'lucide-react';

interface WhoCardProps {
    Icon: React.ElementType;
    title: string;
    description: string;
}

const WhoCard: React.FC<WhoCardProps> = ({ Icon, title, description }) => (
    <FadeInSection>
        <div className="h-full text-center bg-slate-900/50 border border-white/10 rounded-xl p-8 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="inline-block bg-slate-800 p-4 rounded-full mb-6">
                <Icon className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-gray-400">{description}</p>
        </div>
    </FadeInSection>
);

const WhoIsItFor: React.FC = () => {
    const audience = [
        {
            Icon: Sparkles,
            title: "Creators & Hobbyists",
            description: "Unleash your creativity without the steep learning curve. If you have an idea, Cuberama gives you the power to bring it to life in 3D, no prior experience required."
        },
        {
            Icon: PenTool,
            title: "Motion Designers & Freelancers",
            description: "Accelerate your workflow from concept to delivery. Use AI for rapid prototyping and the pro timeline for pixel-perfect control, impressing clients with stunning 3D visuals."
        },
        {
            Icon: Share2,
            title: "Marketers & Social Media Managers",
            description: "Create thumb-stopping social content and product showcases without needing a 3D artist. Boost engagement and explain complex ideas with eye-catching animations."
        },
        {
            Icon: Users,
            title: "Studios & Agencies",
            description: "Empower your team with a versatile tool that fits seamlessly into your pipeline. Perfect for quick turnarounds, collaborative projects, and adding a new dimension to your creative services."
        }
    ];

    return (
        <section id="who-is-it-for" className="py-20 sm:py-32 bg-slate-950/70">
            <div className="container mx-auto px-6">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Built for Every Creator</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Whether you&apos;re a seasoned pro or just starting, Cuberama is designed to fit your creative needs.
                        </p>
                    </div>
                </FadeInSection>

                <div className="mt-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {audience.map((card, index) => (
                        <WhoCard key={index} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhoIsItFor;
