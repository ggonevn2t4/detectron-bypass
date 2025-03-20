
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, FileSearch, ArrowRight, AlertTriangle, FileCheck, Gauge, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIDetectorFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI Content Detector
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Verify if your content will be flagged as AI-generated with our industry-leading accuracy of 99.8%.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth">Try It Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">Learn How It Works</a>
                </Button>
              </div>
              
              <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 p-6">
                <h3 className="text-2xl font-semibold mb-4">Compatible with Major AI Detection Tools</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {["GPTZero", "Turnitin", "ZeroGPT", "Winston AI", "Copyleaks", "Content at Scale", "Originality.AI", "GPT Radar"].map((tool) => (
                    <div key={tool} className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <FileSearch className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm">{tool}</span>
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

        {/* Features Section */}
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

        {/* Risk Assessment Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="bg-background rounded-2xl shadow-md border border-border/40 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold">Content Risk Assessment</h3>
                </div>

                <p className="mb-6">Our AI detection tool categorizes content into risk levels to help you understand the likelihood of being flagged:</p>

                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700">High Risk (80-100%)</h4>
                      <p className="text-red-600">Content will almost certainly be flagged as AI-generated. Immediate humanization recommended.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-700">Medium Risk (40-79%)</h4>
                      <p className="text-amber-600">Content might be flagged by some detection tools. Targeted revisions recommended for highlighted sections.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700">Low Risk (0-39%)</h4>
                      <p className="text-green-600">Content likely to pass as human-written. Minor improvements may still be suggested for complete safety.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Check Your Content Now</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Know exactly how your content performs against AI detection tools and get recommendations for improvement.
              </p>
              <Button size="lg" className="px-8" asChild>
                <Link to="/auth">Try For Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIDetectorFeature;
