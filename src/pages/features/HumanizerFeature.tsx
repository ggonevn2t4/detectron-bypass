
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, Brain, ArrowRight, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HumanizerFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI Humanizer & Paraphraser
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform AI-generated content into human-like text that bypasses AI detection tools with industry-leading 99.8% success rate.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth">Try It Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">Learn How It Works</a>
                </Button>
              </div>
              
              <div className="mt-16 p-6 bg-background rounded-2xl shadow-md border border-border/40">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                    <Shield size={20} />
                    <span className="font-medium">99.8% Detection Bypass Rate</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Supported AI Detection Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["GPTZero", "Turnitin", "ZeroGPT", "Winston AI", "Copyleaks", "Content at Scale", "Originality.AI", "GPT Radar"].map((tool) => (
                    <div key={tool} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
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

        {/* Advanced Features Section */}
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

        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Humanize Your AI Content?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who successfully bypass AI detection with our industry-leading technology.
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

export default HumanizerFeature;
