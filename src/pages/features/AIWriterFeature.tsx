
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './ai-writer/HeroSection';
import FeaturesSection from './ai-writer/FeaturesSection';
import HowItWorksSection from './ai-writer/HowItWorksSection';
import CTASection from './ai-writer/CTASection';
import WriterTool from '@/components/ai-writer/WriterTool';

const AIWriterFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <WriterTool />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AIWriterFeature;
