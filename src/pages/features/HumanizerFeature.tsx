
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './humanizer/HeroSection';
import HowItWorksSection from './humanizer/HowItWorksSection';
import AdvancedFeaturesSection from './humanizer/AdvancedFeaturesSection';
import CTASection from './humanizer/CTASection';

const HumanizerFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <HowItWorksSection />
        <AdvancedFeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HumanizerFeature;
