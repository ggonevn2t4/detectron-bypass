
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from './ai-writer/HeroSection';
import FeaturesSection from './ai-writer/FeaturesSection';
import HowItWorksSection from './ai-writer/HowItWorksSection';
import CTASection from './ai-writer/CTASection';
import WriterTool from '@/components/ai-writer/WriterTool';
import { Container } from '@/components/ui/container';

const AIWriterFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection />
        
        {/* Tool Section with Background */}
        <section className="py-16 bg-primary/5">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Try Our AI Writer Tool</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Generate high-quality content in seconds with our advanced AI Writer. 
                Customize the topic, length, and tone to fit your needs.
              </p>
            </div>
          </Container>
          <WriterTool />
        </section>
        
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AIWriterFeature;
