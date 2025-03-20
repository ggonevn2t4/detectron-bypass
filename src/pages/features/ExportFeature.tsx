
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './export/HeroSection';
import FeaturesSection from './export/FeaturesSection';
import ExportProcessSection from './export/ExportProcessSection';
import CTASection from './export/CTASection';

const ExportFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <ExportProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default ExportFeature;
