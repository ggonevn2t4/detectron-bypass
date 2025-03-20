
import React from 'react';
import { Container } from '@/components/ui/container';
import { CheckCircle } from 'lucide-react';

const ExportProcessSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Seamless Export Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our intuitive export process ensures you can quickly get your content in any format you need.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-xl border border-border/40 p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">1</div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Select Content</h3>
              <p className="text-muted-foreground">Choose which generated or humanized content you want to export.</p>
            </div>

            <div className="bg-background rounded-xl border border-border/40 p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">2</div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Choose Format</h3>
              <p className="text-muted-foreground">Select from multiple formats including Word, PDF, Google Docs, and more.</p>
            </div>

            <div className="bg-background rounded-xl border border-border/40 p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">3</div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Export & Share</h3>
              <p className="text-muted-foreground">Download instantly or export directly to your favorite cloud services.</p>
            </div>
          </div>

          <div className="mt-12 bg-background rounded-xl border border-border/40 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-xl font-semibold">Custom Export Options</h3>
            </div>

            <p className="mb-4">Tailor your exports with additional customization options:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Include or exclude references section",
                "Add cover pages to documents",
                "Set custom headers and footers",
                "Apply institution-specific formatting",
                "Include metadata for academic submissions",
                "Set custom page margins and layouts",
                "Add watermarks or confidentiality notices",
                "Export selected sections only"
              ].map((item, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExportProcessSection;
