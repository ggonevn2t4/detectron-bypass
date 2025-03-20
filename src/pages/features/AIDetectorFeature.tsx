
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './ai-detector/HeroSection';
import HowItWorksSection from './ai-detector/HowItWorksSection';
import AdvancedFeaturesSection from './ai-detector/AdvancedFeaturesSection';
import RiskAssessmentSection from './ai-detector/RiskAssessmentSection';
import CTASection from './ai-detector/CTASection';
import DetectorTool from '@/components/ai-detector/DetectorTool';

const AIDetectorFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <DetectorTool />
        <HowItWorksSection />
        <AdvancedFeaturesSection />
        <RiskAssessmentSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AIDetectorFeature;
