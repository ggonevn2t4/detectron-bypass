
import React from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Humanizer & Paraphraser
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform AI-generated content into human-like text that bypasses AI detection tools with industry-leading 99.8% success rate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Try It Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">Learn How It Works</a>
            </Button>
          </div>
          
          <div className="mt-16 p-6 bg-background rounded-2xl shadow-md border border-border/40">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Shield size={20} />
                <span className="font-medium">99.8% Detection Bypass Rate</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Supported AI Detection Tools</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["GPTZero", "Turnitin", "ZeroGPT", "Winston AI", "Copyleaks", "Content at Scale", "Originality.AI", "GPT Radar"].map((tool) => (
                <div key={tool} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{tool}</span>
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
