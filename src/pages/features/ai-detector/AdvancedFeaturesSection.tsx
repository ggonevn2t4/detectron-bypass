
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';

const AdvancedFeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Advanced Detection Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI content detector provides comprehensive insights to help you evaluate and improve your content.
          </p>
        </div>

        <Tabs defaultValue="probability" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="probability">Detection Probability</TabsTrigger>
            <TabsTrigger value="analysis">Content Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="probability" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Detection Probability</h3>
            <p className="mb-4">Our detector provides a detailed breakdown of how likely your content is to be flagged by different AI detection tools:</p>
            <ul className="space-y-2">
              {[
                "Overall detection probability percentage",
                "Tool-by-tool breakdown of detection likelihood",
                "Confidence level assessment for each detection tool",
                "Historical comparison with similar content"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="analysis" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Content Analysis</h3>
            <p className="mb-4">Get detailed insights into what aspects of your content appear AI-generated:</p>
            <ul className="space-y-2">
              {[
                "Sentence-by-sentence analysis of AI probability",
                "Highlighted sections most likely to trigger detection",
                "Vocabulary and phrase pattern assessment",
                "Statistical pattern analysis that detectors look for"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="recommendations" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
            <p className="mb-4">Receive specific suggestions for improving your content:</p>
            <ul className="space-y-2">
              {[
                "Specific rewriting suggestions for problematic sections",
                "One-click humanize option for flagged content",
                "Vocabulary alternatives to reduce AI patterns",
                "Structure improvements to appear more human-written"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </Container>
    </section>
  );
};

export default AdvancedFeaturesSection;
