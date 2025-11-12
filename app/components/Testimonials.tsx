import React from 'react';
import FadeInSection from './FadeInSection';
import { Quote } from 'lucide-react';

const testimonialsData = [
    {
        avatar: 'https://i.pravatar.cc/80?u=jessica',
        name: 'Jessica Adams',
        title: 'Freelance Motion Designer',
        quote: "Cuberama's AI generator is a game-changer. I can now create stunning client drafts in minutes instead of hours. The quality is incredible, and it gives me a fantastic starting point for my detailed work."
    },
    {
        avatar: 'https://i.pravatar.cc/80?u=mark',
        name: 'Mark Chen',
        title: 'Founder, Ember Studios',
        quote: "As a small studio, we need tools that are both powerful and efficient. Cuberama fits perfectly. It's intuitive enough for our junior artists but has the depth needed for complex projects. All in the browser—unbelievable."
    },
    {
        avatar: 'https://i.pravatar.cc/80?u=sarah',
        name: 'Sarah Jenkins',
        title: 'Social Media Manager',
        quote: "I'm not a 3D artist, but with Cuberama, I can create professional-looking animations for our social channels. The templates and AI suggestions make it so easy to get a polished result. Our engagement has skyrocketed!"
    }
];

interface TestimonialCardProps {
    avatar: string;
    name: string;
    title: string;
    quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ avatar, name, title, quote }) => (
    <FadeInSection>
        <div className="h-full bg-slate-900/50 border border-white/10 rounded-xl p-6 flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
            <Quote className="h-8 w-8 text-cyan-400 mb-4" />
            <p className="text-gray-300 flex-grow">"{quote}"</p>
            <div className="mt-6 flex items-center gap-4">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
                <div>
                    <h4 className="font-bold text-white">{name}</h4>
                    <p className="text-sm text-gray-400">{title}</p>
                </div>
            </div>
        </div>
    </FadeInSection>
);

const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="py-20 sm:py-32 bg-slate-950">
            <div className="container mx-auto px-6">
                <FadeInSection>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Loved by Creators Worldwide</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            See how professionals and hobbyists alike are bringing their visions to life with Cuberama.
                        </p>
                    </div>
                </FadeInSection>

                <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
