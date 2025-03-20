
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Content Detector
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Verify if your content will be flagged as AI-generated with our industry-leading accuracy of 99.8%.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Try It Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>
          
          <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 p-6">
            <h3 className="text-2xl font-semibold mb-4">Compatible with Major AI Detection Tools</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {["GPTZero", "Turnitin", "ZeroGPT", "Winston AI", "Copyleaks", "Content at Scale", "Originality.AI", "GPT Radar"].map((tool) => (
                <div key={tool} className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <FileSearch className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
