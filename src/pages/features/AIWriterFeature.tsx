
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, ArrowRight, BookOpen, Quote, Sparkles, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIWriterFeature = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI Writer with Custom Citations
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Generate high-quality papers, articles, and content with proper citations and references in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/auth">Try It Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">View Features</a>
                </Button>
              </div>
              
              <div className="mt-16 bg-background rounded-2xl shadow-md border border-border/40 overflow-hidden">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  {[
                    {
                      icon: <BookOpen className="h-6 w-6 text-primary" />,
                      title: "Multiple Citation Styles",
                      description: "APA, MLA, Chicago, Harvard, IEEE and more"
                    },
                    {
                      icon: <Quote className="h-6 w-6 text-primary" />,
                      title: "In-text Citations",
                      description: "Automatically adds proper in-text citations"
                    },
                    {
                      icon: <Sparkles className="h-6 w-6 text-primary" />,
                      title: "Human-like Quality",
                      description: "Content passes AI detection checks"
                    }
                  ].map((feature, i) => (
                    <div key={i} className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 p-3 rounded-full mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
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

        {/* How It Works Section */}
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

        {/* CTA Section */}
        <section className="py-20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Start Creating Well-Cited Content Today</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of students, researchers, and content creators who save time while producing high-quality work.
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

export default AIWriterFeature;
