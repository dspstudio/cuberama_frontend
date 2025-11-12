import React, { useState } from 'react';
import FadeInSection from './FadeInSection';
import {
    UploadCloud, Video, Crop, Grid3x3, // Import & Setup
    Spline, Sparkles, Layers, LayoutTemplate, // Animation & Timeline
    Image as ImageIcon, Globe, Box, Wand2, // Styling & Effects
    Film, Camera, FileVideo, Package, // Export & Share
    ChevronDown, ChevronUp
} from 'lucide-react';

// Reusable Feature Card Component
interface FeatureCardProps {
    Icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => (
    <FadeInSection>
        <div className="h-full text-left">
            <div className="inline-block bg-slate-800 p-3 rounded-lg mb-4">
                <Icon className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-md font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
    </FadeInSection>
);

// Feature Category Component
interface FeatureCategoryProps {
    title: string;
    features: FeatureCardProps[];
}

const FeatureCategory: React.FC<FeatureCategoryProps> = ({ title, features }) => (
    <div className="mt-20">
        <FadeInSection>
            <h3 className="text-2xl font-bold text-white text-center sm:text-left">{title}</h3>
        </FadeInSection>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {features.map(feature => (
                <FeatureCard key={feature.title} {...feature} />
            ))}
        </div>
    </div>
);

// Main Features Data - Reordered to show most important ones first
const featureCategories: FeatureCategoryProps[] = [
    {
        title: "Animation & Timeline",
        features: [
            { Icon: Sparkles, title: "AI Animation Generator", description: "Describe the animation you want in plain English and let AI build the entire timeline for you." },
            { Icon: Spline, title: "Powerful Keyframe Editor", description: "Create complex animations with an intuitive timeline. Control camera, object rotation, timing, and easing." },
            { Icon: Layers, title: "Multi-Media Timeline", description: "Combine multiple images and video clips in a single animation. Adjust durations and reorder with ease." },
            { Icon: LayoutTemplate, title: "Project Templates", description: "Kickstart your project by loading pre-built templates for common animation styles." }
        ]
    },
    {
        title: "Styling & Effects",
        features: [
            { Icon: ImageIcon, title: "Dynamic Backgrounds", description: "Choose between solid colors, AI-generated images, custom gradients, or your own uploaded pictures." },
            { Icon: Globe, title: "Environment Lighting", description: "Use HDRI skyboxes for realistic, image-based lighting and reflections on your object." },
            { Icon: Box, title: "PBR Materials", description: "Transform your media with physically-based glass, metallic, and iridescent materials. Upload your own PBR texture maps (Color, Roughness, Normal, etc.)." },
            { Icon: Wand2, title: "Post-Processing FX", description: "Add a final polish with a full suite of effects: Bloom, Outline, Vignette, Drop Shadow, Chromatic Aberration, and more." }
        ]
    },
    {
        title: "Import & Setup",
        features: [
            { Icon: UploadCloud, title: "Versatile Media Import", description: "Upload images and videos via file picker or simply drag and drop. Supports all common formats." },
            { Icon: Video, title: "Live Recording", description: "Record your screen or camera directly into the app to start animating immediately." },
            { Icon: Crop, title: "Aspect Ratio Control", description: "Switch between popular formats like 16:9, 9:16, 1:1, 4:3, 16:10, and more for any platform." },
            { Icon: Grid3x3, title: "Composition Guides", description: "Frame your perfect shot using Rule of Thirds, Safe Margins, and Center Guide overlays." }
        ]
    },
    {
        title: "Export & Share",
        features: [
            { Icon: Film, title: "High-Quality Video", description: "Export as MP4 or WebM at up to 4K resolution and 120 FPS, with control over codecs and bitrate." },
            { Icon: Camera, title: "Still Image Capture", description: "Export any frame of your animation as a high-resolution PNG or JPEG image." },
            { Icon: FileVideo, title: "Animated GIF Export", description: "Create animated GIFs with options for size, frame rate, quality, and looping." },
            { Icon: Package, title: "Full Project Portability", description: "Save your entire project—media, animation, and all settings—into a single portable .zip file." }
        ]
    }
];

const Features: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialCategories = featureCategories.slice(0, 2);
  const expandableCategories = featureCategories.slice(2);

  return (
    <section id="features" className="py-20 sm:py-32 bg-slate-950">
      <div className="container mx-auto px-6">
        <FadeInSection>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white">Every Feature You Need</h2>
                <p className="mt-4 text-lg text-gray-400">
                    From initial import to final export, Cuberama provides a complete, professional-grade toolkit to bring your vision to life.
                </p>
            </div>
        </FadeInSection>

        {initialCategories.map(category => (
            <FeatureCategory key={category.title} title={category.title} features={category.features} />
        ))}
        
        <div className={`transition-all duration-700 ease-in-out overflow-hidden grid ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="min-w-full">
            {expandableCategories.map(category => (
                <FeatureCategory key={category.title} title={category.title} features={category.features} />
            ))}
          </div>
        </div>

        <FadeInSection>
            <div className="mt-20 text-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'Show Less' : 'Show All Features'}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
            </div>
        </FadeInSection>
      </div>
    </section>
  );
};

export default Features;