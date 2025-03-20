
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, Gauge, Shield } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Our AI Detector Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our advanced technology identifies AI-generated content with exceptional accuracy through a multi-step analysis process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FileCheck size={24} />
              </div>
              <CardTitle>1. Content Analysis</CardTitle>
              <CardDescription>
                Our system performs a deep analysis of your text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>We examine linguistic patterns, sentence structures, vocabulary usage, and statistical regularities that typically appear in AI-generated content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Gauge size={24} />
              </div>
              <CardTitle>2. Multi-Tool Simulation</CardTitle>
              <CardDescription>
                We simulate results from multiple detection tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Our system simultaneously checks how your content would perform against multiple major AI detection tools, providing a comprehensive assessment.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Shield size={24} />
              </div>
              <CardTitle>3. Detailed Report</CardTitle>
              <CardDescription>
                Get actionable insights to improve your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Receive a detailed report showing the detection probability, problematic sections, and specific recommendations for making your content pass as human-written.</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
