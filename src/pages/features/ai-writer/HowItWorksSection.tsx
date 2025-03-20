
import React from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Sparkles, Lightbulb, FileText } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create high-quality content with proper citations in just a few simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="step1" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="step1">Step 1</TabsTrigger>
              <TabsTrigger value="step2">Step 2</TabsTrigger>
              <TabsTrigger value="step3">Step 3</TabsTrigger>
              <TabsTrigger value="step4">Step 4</TabsTrigger>
            </TabsList>
            <TabsContent value="step1" className="p-6 bg-background rounded-xl border border-border/40">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Define Your Topic</h3>
                  <p className="mb-4">Start by entering your topic or research question. You can specify the type of content you need, whether it's an academic paper, blog post, or any other format.</p>
                  <p className="text-muted-foreground">You can also provide additional instructions or requirements, such as word count, tone, or specific points to include.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step2" className="p-6 bg-background rounded-xl border border-border/40">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Your Sources</h3>
                  <p className="mb-4">Upload or paste links to your sources for accurate citations. Our system will automatically extract the necessary information for proper referencing.</p>
                  <p className="text-muted-foreground">Support for books, journal articles, websites, PDFs, and more. You can also manually enter source information if needed.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step3" className="p-6 bg-background rounded-xl border border-border/40">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generate Your Content</h3>
                  <p className="mb-4">Once you've provided your topic and sources, our AI will generate well-structured, thoroughly-researched content with proper in-text citations.</p>
                  <p className="text-muted-foreground">The generated content is academically sound and passes AI detection tests, making it suitable for submission.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="step4" className="p-6 bg-background rounded-xl border border-border/40">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review and Export</h3>
                  <p className="mb-4">Review your generated content, make any necessary edits, and export it in your preferred format. The bibliography/references section is automatically generated according to your chosen citation style.</p>
                  <p className="text-muted-foreground">Export options include Word, PDF, Google Docs, and plain text formats.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;
