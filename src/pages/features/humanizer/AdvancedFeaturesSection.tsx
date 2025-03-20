
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';

const AdvancedFeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our humanizer goes beyond basic paraphrasing to ensure your content remains original and undetectable.
          </p>
        </div>

        <Tabs defaultValue="semantic" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="semantic">Semantic Preservation</TabsTrigger>
            <TabsTrigger value="style">Style Customization</TabsTrigger>
            <TabsTrigger value="detection">Detection Avoidance</TabsTrigger>
          </TabsList>
          <TabsContent value="semantic" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Semantic Preservation</h3>
            <p className="mb-4">Our AI ensures that the original meaning of your content is preserved while restructuring sentences and vocabulary to appear more human-like.</p>
            <ul className="space-y-2">
              {[
                "Maintains key information and arguments",
                "Preserves logical flow and context",
                "Retains technical accuracy and terminology",
                "Ensures citations and references remain intact"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="style" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Style Customization</h3>
            <p className="mb-4">Adjust the writing style to match your preferences or specific requirements:</p>
            <ul className="space-y-2">
              {[
                "Select academic level (high school to postgraduate)",
                "Adjust formality levels",
                "Choose writing tones (professional, casual, persuasive)",
                "Match specific writing styles from different disciplines"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="detection" className="p-6 bg-background rounded-xl border border-border/40">
            <h3 className="text-xl font-semibold mb-4">Detection Avoidance</h3>
            <p className="mb-4">Our advanced algorithms specifically target patterns that AI detectors look for:</p>
            <ul className="space-y-2">
              {[
                "Eliminates statistical regularities found in AI text",
                "Introduces natural language imperfections",
                "Varies sentence structures and transitions",
                "Adds human-like language inconsistencies"
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
