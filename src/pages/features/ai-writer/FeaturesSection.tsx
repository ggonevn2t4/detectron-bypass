
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, FileText } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Advanced Writing Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI Writer offers powerful tools to help you create well-researched and properly cited content with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <BookOpen size={24} />
              </div>
              <CardTitle>Academic Writing</CardTitle>
              <CardDescription>
                Generate well-structured academic papers with proper citations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Create papers across various academic disciplines",
                  "Supports all major citation styles (APA, MLA, Chicago, etc.)",
                  "Generate abstracts, introductions, literature reviews, and more",
                  "Add custom in-text citations from your sources"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FileText size={24} />
              </div>
              <CardTitle>Content Creation</CardTitle>
              <CardDescription>
                Generate engaging articles and content for any purpose
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "Create blog posts, articles, and web content",
                  "Generate social media content and newsletters",
                  "Develop marketing materials and product descriptions",
                  "Write scripts for videos and presentations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;
