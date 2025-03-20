
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Quick Export Options
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Export your humanized and AI-generated content to multiple formats with a single click.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Try It Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">View Features</a>
            </Button>
          </div>
          
          <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 p-6">
            <h3 className="text-2xl font-semibold mb-6">Supported Export Formats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {[
                { name: "Word", icon: <FileText size={24} /> },
                { name: "PDF", icon: <FileText size={24} /> },
                { name: "Google Docs", icon: <FileText size={24} /> },
                { name: "Plain Text", icon: <FileText size={24} /> },
                { name: "Markdown", icon: <FileText size={24} /> },
                { name: "HTML", icon: <FileText size={24} /> }
              ].map((format, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    {format.icon}
                  </div>
                  <span className="text-sm">{format.name}</span>
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
