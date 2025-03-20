
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, ArrowRight, FileText, Share2, ClipboardCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExportFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Quick Export Options
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Export your humanized and AI-generated content to multiple formats with a single click.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth">Try It Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">View Features</a>
                </Button>
              </div>
              
              <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 p-6">
                <h3 className="text-2xl font-semibold mb-6">Supported Export Formats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {[
                    { name: "Word", icon: <FileText size={24} /> },
                    { name: "PDF", icon: <FileText size={24} /> },
                    { name: "Google Docs", icon: <FileText size={24} /> },
                    { name: "Plain Text", icon: <FileText size={24} /> },
                    { name: "Markdown", icon: <FileText size={24} /> },
                    { name: "HTML", icon: <FileText size={24} /> }
                  ].map((format, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {format.icon}
                      </div>
                      <span className="text-sm">{format.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
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

        {/* Export Process Section */}
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

        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Start Exporting Your Content Today</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Experience seamless exports and integrations with our powerful platform.
              </p>
              <Button size="lg" className="px-8" asChild>
                <Link to="/auth">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ExportFeature;
