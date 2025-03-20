
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Brain, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Our AI Humanizer Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced technology carefully transforms AI-generated text while preserving meaning and context.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FileText size={24} />
              </div>
              <CardTitle>1. Paste Your Content</CardTitle>
              <CardDescription>
                Simply paste your AI-generated text into our editor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>The platform accepts content from any AI source, including ChatGPT, Claude, Bard, and more. No limitations on word count.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Brain size={24} />
              </div>
              <CardTitle>2. Humanization Process</CardTitle>
              <CardDescription>
                Our advanced algorithms transform the text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We analyze patterns, restructure sentences, adjust vocabulary, and add natural language variations while preserving your content's original meaning.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Zap size={24} />
              </div>
              <CardTitle>3. Get Undetectable Content</CardTitle>
              <CardDescription>
                Download your humanized text, ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Within seconds, receive your humanized content that bypasses AI detection tools while maintaining quality, tone, and meaning.</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
