
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Share2, ClipboardCheck, Clock } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Export Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers versatile export options to make your workflow seamless and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Download size={24} />
              </div>
              <CardTitle>One-Click Download</CardTitle>
              <CardDescription>
                Download your content instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Quickly download your content in your preferred format with just a single click.</p>
              <ul className="space-y-2">
                {[
                  "Multiple format options",
                  "Instant downloads",
                  "No file size limits",
                  "Batch processing available"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Share2 size={24} />
              </div>
              <CardTitle>Cloud Integration</CardTitle>
              <CardDescription>
                Export directly to cloud services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Seamlessly export your content to popular cloud storage and document services.</p>
              <ul className="space-y-2">
                {[
                  "Google Drive integration",
                  "Microsoft OneDrive support",
                  "Dropbox compatibility",
                  "Direct to Google Docs"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <ClipboardCheck size={24} />
              </div>
              <CardTitle>Format Preservation</CardTitle>
              <CardDescription>
                Maintain your document formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">All formatting, citations, and document structure are preserved during export.</p>
              <ul className="space-y-2">
                {[
                  "Citations remain intact",
                  "Headings structure preserved",
                  "Tables and lists maintained",
                  "Images and diagrams included"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Clock size={24} />
              </div>
              <CardTitle>Version History</CardTitle>
              <CardDescription>
                Access previous versions anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">All your exports are saved with version history for future reference and reuse.</p>
              <ul className="space-y-2">
                {[
                  "Access previous exports",
                  "Compare different versions",
                  "Restore older documents",
                  "Track document evolution"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-sm">{item}</span>
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
