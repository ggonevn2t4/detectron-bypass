
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-primary/5">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Check Your Content Now</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Know exactly how your content performs against AI detection tools and get recommendations for improvement.
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link to="/auth">Try For Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
