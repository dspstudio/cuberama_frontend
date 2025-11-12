
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Hero from './Hero';
import Features from './Features';
import CTA from './CTA';
import Workflow from './Workflow';
import Testimonials from './Testimonials';
import FeatureSpotlight from './FeatureSpotlight';
import UseCases from './UseCases';
import AnimateAnything from './AnimateAnything';
import CookieConsent from './CookieConsent';
import { useContactModal } from '../contexts/ContactModalContext';
import ContactFormModal from './ContactFormModal';
import Pricing from './Pricing';
import { useInfoModal, InfoModalType } from '../contexts/InfoModalContext';
import InfoModal from './InfoModal';
import WhoIsItFor from './WhoIsItFor';
import BackToTopButton from './BackToTopButton';
import Tutorials from './Tutorials';

const getModalContent = (modal: InfoModalType) => {
    switch (modal) {
      case 'about':
        return {
          title: 'About Cuberama',
          content: (
            <div className="space-y-4 text-gray-300">
              <p>Cuberama was born from a simple idea: professional 3D animation should be accessible to everyone, not just studios with big budgets and powerful hardware. We are a passionate team of developers, designers, and 3D artists dedicated to building a tool that is both powerful and intuitive.</p>
              <p>Our mission is to democratize creativity by leveraging the power of AI and the web. By removing technical barriers and steep learning curves, we empower creators, marketers, and storytellers to bring their visions to life in a new dimension. Whether you&apos;re creating your first animation or you&apos;re a seasoned professional, Cuberama is built for you.</p>
            </div>
          ),
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          content: (
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using Cuberama, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. User Conduct</h3>
                <p>You agree not to use the service to create content that is unlawful, harmful, threatening, abusive, or otherwise objectionable. You are solely responsible for the content you create and share using Cuberama.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">3. Intellectual Property</h3>
                <p>You retain all ownership rights to the content you create. By using our service, you grant Cuberama a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content solely for the purpose of operating and improving the service.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">4. Limitation of Liability</h3>
                <p>Cuberama is provided &quot;as is&quot; without any warranties. In no event shall Cuberama be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the service.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">5. Changes to Terms</h3>
                <p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this site.</p>
              </div>
            </div>
          ),
        };
      case 'cookies':
         return {
          title: 'Cookie Policy',
          content: (
             <div className="space-y-4 text-gray-300">
               <div>
                <h3 className="text-lg font-bold text-white mb-2">What Are Cookies?</h3>
                <p>Cookies are small text files stored on your device that help us provide and improve our services. They are used to remember your preferences, keep you logged in, and analyze site traffic.</p>
              </div>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">How We Use Cookies</h3>
                <p>We use cookies for several purposes:</p>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                  <li><strong>Essential Cookies:</strong> These are necessary for the website to function, such as managing your authentication session.</li>
                  <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve the user experience.</li>
                  <li><strong>Functionality Cookies:</strong> These are used to remember choices you make (such as your username or language preference) to provide a more personalized experience.</li>
                </ul>
              </div>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">Your Choices</h3>
                <p>By using Cuberama, you agree that we can place these types of cookies on your device. You can manage your cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of our service.</p>
              </div>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: (
             <div className="space-y-4 text-gray-300">
                <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and share information about you when you use Cuberama.</p>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                    <li><strong>Account Information:</strong> When you register, we collect your email address and any other information you provide, like your name or avatar.</li>
                    <li><strong>Content:</strong> We collect the media files (images, videos) you upload to animate. We only use this content to provide the service to you.</li>
                    <li><strong>Usage Information:</strong> We collect information about your activity on our service, like which features you use and how often.</li>
                </ul>
              </div>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">How We Use Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, including to authenticate users, process transactions, and develop new features.</p>
              </div>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">Data Security</h3>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We use third-party services like Supabase for authentication and storage, which provide industry-standard security.</p>
              </div>
               <div>
                <h3 className="text-lg font-bold text-white mb-2">Your Rights</h3>
                <p>You have the right to access, update, or delete your personal information. You can manage your account information from your dashboard settings.</p>
              </div>
            </div>
          ),
        };
      default:
        return { title: '', content: null };
    }
  };

const LandingPage: React.FC = () => {
  const { isContactModalOpen, closeContactModal } = useContactModal();
  const { activeModal, closeInfoModal } = useInfoModal();
  const router = useRouter();

  const { title, content } = getModalContent(activeModal);
  
  const handleLaunch = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-slate-950 relative">
      <main className="relative z-10">
        <Hero />
        <WhoIsItFor />
        <section id="how-it-works">
          <Workflow />
        </section>
        <section id="features">
          <Features />
        </section>
        <FeatureSpotlight />
        <section id="tutorials">
          <Tutorials />
        </section>
        <AnimateAnything />
        <Testimonials />
        <section id="use-cases">
          <UseCases />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <CTA onLaunch={handleLaunch} />
      </main>
      <CookieConsent />
      <ContactFormModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      <InfoModal isOpen={!!activeModal} onClose={closeInfoModal} title={title}>
          {content}
      </InfoModal>
      <BackToTopButton />
    </div>
  );
};

export default LandingPage;
