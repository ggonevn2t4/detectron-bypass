
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Exporting Your Content Today</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience seamless exports and integrations with our powerful platform.
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link to="/auth">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
