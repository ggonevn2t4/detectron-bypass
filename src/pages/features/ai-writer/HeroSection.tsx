
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { BookOpen, Quote, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Writer with Custom Citations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Generate high-quality papers, articles, and content with proper citations and references in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Try It Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">View Features</a>
            </Button>
          </div>
          
          <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              {[
                {
                  icon: <BookOpen className="h-6 w-6 text-primary" />,
                  title: "Multiple Citation Styles",
                  description: "APA, MLA, Chicago, Harvard, IEEE and more"
                },
                {
                  icon: <Quote className="h-6 w-6 text-primary" />,
                  title: "In-text Citations",
                  description: "Automatically adds proper in-text citations"
                },
                {
                  icon: <Sparkles className="h-6 w-6 text-primary" />,
                  title: "Human-like Quality",
                  description: "Content passes AI detection checks"
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
