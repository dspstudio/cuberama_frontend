import { ArrowRight, Clock, BarChart3, Sparkles, LucideIcon } from 'lucide-react'; // Import LucideIcon type

export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  Icon: LucideIcon; // Use LucideIcon type
  keywords: string[];
  ogImage: string;
}

export const mockTutorials: Tutorial[] = [
  {
    slug: 'your-first-animation-with-ai',
    title: "Your First Animation with AI",
    description: "Learn how to go from a simple text prompt to a full animation in under 60 seconds.",
    category: "Animation",
    level: "Beginner",
    duration: "3 min",
    Icon: Sparkles,
    keywords: ["AI animation", "first animation", "text to animation", "Cuberama AI"],
    ogImage: "/images/og-your-first-animation.jpg", // Placeholder
  },
  {
    slug: 'mastering-the-timeline',
    title: "Mastering the Timeline",
    description: "Dive deep into the keyframe editor to gain precise control over your creations.",
    category: "Editing",
    level: "Intermediate",
    duration: "8 min",
    Icon: BarChart3,
    keywords: ["timeline editing", "keyframe editor", "Cuberama editing"],
    ogImage: "/images/og-mastering-timeline.jpg", // Placeholder
  },
  {
    slug: 'realistic-materials-lighting',
    title: "Realistic Materials & Lighting",
    description: "Discover how to use PBR materials and HDRI lighting to achieve photorealistic results.",
    category: "Rendering",
    level: "Advanced",
    duration: "12 min",
    Icon: Sparkles,
    keywords: ["PBR materials", "HDRI lighting", "photorealistic rendering", "Cuberama rendering"],
    ogImage: "/images/og-realistic-materials.jpg", // Placeholder
  },
  {
    slug: 'exporting-for-social-media',
    title: "Exporting for Social Media",
    description: "Master the export settings to get the perfect format and quality for any platform.",
    category: "Exporting",
    level: "Beginner",
    duration: "5 min",
    Icon: ArrowRight,
    keywords: ["export settings", "social media export", "Cuberama export"],
    ogImage: "/images/og-exporting-social-media.jpg", // Placeholder
  },
    {
    slug: 'advanced-camera-techniques',
    title: "Advanced Camera Techniques",
    description: "Learn about focal length, depth of field, and camera tracking to create cinematic shots.",
    category: "Cinematography",
    level: "Advanced",
    duration: "15 min",
    Icon: Clock,
    keywords: ["camera techniques", "focal length", "depth of field", "camera tracking", "cinematic shots", "Cuberama cinematography"],
    ogImage: "/images/og-advanced-camera.jpg", // Placeholder
  },
  {
    slug: 'character-rigging-basics',
    title: "Character Rigging Basics",
    description: "An introduction to bones, skinning, and weight painting for bringing characters to life.",
    category: "Animation",
    level: "Intermediate",
    duration: "18 min",
    Icon: BarChart3,
    keywords: ["character rigging", "bones", "skinning", "weight painting", "Cuberama animation"],
    ogImage: "/images/og-character-rigging.jpg", // Placeholder
  },
];
