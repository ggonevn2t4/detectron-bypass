import React from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-primary/10 to-muted/50 pt-20 pb-16 md:pt-24 md:pb-20">
      <Container>
        <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">
                {t('hero.tryButton')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#features">
                {t('hero.features')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "AI Humanizer",
              description: "Transform AI-generated content to pass as human-written",
              path: "/features/humanizer"
            },
            {
              title: "AI Writer",
              description: "Generate papers with proper citations and references",
              path: "/features/ai-writer"
            },
            {
              title: "AI Detector",
              description: "Check if your content will be flagged as AI-generated",
              path: "/features/ai-detector"
            },
            {
              title: "Quick Export",
              description: "Export your content to multiple formats with ease",
              path: "/features/export"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-background rounded-xl border border-border/40 p-6 flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{feature.description}</p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={feature.path}>
                  Learn More
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Hero;
