
export const SHADER_ENABLED = true;

export interface Feature {
  text: string;
  tooltip?: string;
}

export interface PricingPlan {
  name: 'Freemium' | 'Pro';
  price: string;
  originalPrice?: string;
  billingCycle: string;
  description: string;
  features: Feature[];
  cta: string;
  isPopular: boolean;
  stripeLink: string;
}

export const cuberama3DAppLink = 'https://dsp-studio.ro/2123423/'

const proFeatures: Feature[] = [
  { text: '4K Resolution', tooltip: 'Export in stunning 4K UHD (3840x2160) for the highest possible quality.' },
  { text: 'No Watermark', tooltip: 'Export clean videos with no Cuberama branding. Ideal for client work and commercial use.' },
  { text: 'Up to 120 FPS Export', tooltip: 'Achieve ultra-smooth motion and slow-motion effects by exporting at 120 frames per second.' },
  { text: '3 min Animation Length', tooltip: 'While the editor can handle longer sequences, we recommend a 3-minute maximum for optimal browser performance and rendering speed.' },
  { text: 'Unlimited AI Generations', tooltip: 'Unleash your creativity with no limits. Generate as many AI animations as you need for rapid iteration.' },
  { text: 'Post-Processing FX & HDRI', tooltip: 'Access a full suite of effects like Bloom and Vignette, and use HDRI for realistic lighting.' },
  { text: 'Texture & Env Map Collection', tooltip: 'Access our curated library of high-quality PBR textures and professional HDRI environment maps.' },
  { text: 'Priority Support', tooltip: 'Get faster, prioritized responses from our support team to resolve any issues.' },
  { text: 'Future updates included', tooltip: 'All future software updates, including new features and improvements, are included with your plan.' },
];

const freemiumFeatures: Feature[] = [
  { text: '720p Resolution Export', tooltip: 'Export videos in HD (1280x720). Great for social media and web use. Upgrade to Pro for stunning 4K quality.' },
  { text: 'Watermarked Exports', tooltip: 'All videos exported on the Freemium plan will include a small Cuberama watermark. Upgrade to Pro to remove it.' },
  { text: 'Up to 60 FPS Export', tooltip: 'Export smooth animations at up to 60 frames per second. Pro users can export at an ultra-smooth 120 FPS for slow-motion effects.' },
  { text: '30 sec Animation Length', tooltip: 'Create animations up to 30 seconds long. Perfect for short clips and social media posts. Pro allows up to 3 minutes.' },
  { text: '10 AI Generations per month', tooltip: 'You get 10 credits per month to use the AI Animation Generator. Credits reset on the first of each month. Upgrade for unlimited generations.' },
  { text: 'Basic Materials & Lighting', tooltip: 'Access a selection of standard materials and lighting setups. Upgrade to Pro for advanced PBR materials (Glass, Metallic), HDRI lighting, and post-processing FX.' },
  { text: 'Community Support', tooltip: 'Get help from fellow creators and our team in the community forums and Discord server.' },
  { text: 'Future updates included', tooltip: 'All future software updates, including new features and improvements, are included with your plan.' },
];

export const PRICING_PLANS_USD: PricingPlan[] = [
  {
    name: 'Freemium',
    price: '$0',
    billingCycle: 'Free forever',
    description: 'Perfect for hobbyists and anyone getting started with 3D animation.',
    features: freemiumFeatures,
    cta: 'Start for Free',
    isPopular: false,
    stripeLink: '',
  },
  {
    name: 'Pro',
    price: '$49.99',
    originalPrice: '$99.99',
    billingCycle: '14-day free trial, then one-time payment. Cancel anytime.',
    description: 'The complete toolkit for professionals, studios and power users who demand the absolute best.',
    features: proFeatures,
    cta: 'Start 14-Day Pro Trial',
    isPopular: true,
    stripeLink: 'https://buy.stripe.com/test_aFaaEZfu6ciQ1xj8FY33W04?prefilled_promo_code=test50',
  },
];

export const PRICING_PLANS_EUR: PricingPlan[] = [
  {
    name: 'Freemium',
    price: '€0',
    billingCycle: 'Free forever',
    description: 'Perfect for hobbyists and anyone getting started with 3D animation.',
    features: freemiumFeatures,
    cta: 'Start for Free',
    isPopular: false,
    stripeLink: '',
  },
  {
    name: 'Pro',
    price: '€49.99',
    originalPrice: '€99.99',
    billingCycle: '14-day free trial, then one-time payment. Cancel anytime.',
    description: 'The complete toolkit for professionals, studios and power users who demand the absolute best.',
    features: proFeatures,
    cta: 'Start 14-Day Pro Trial',
    isPopular: true,
    stripeLink: 'https://buy.stripe.com/test_aFaaEZfu6ciQ1xj8FY33W04?prefilled_promo_code=test50',
  },
];
