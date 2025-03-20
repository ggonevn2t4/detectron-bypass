
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import HumanizerTool from '@/components/HumanizerTool';
import Footer from '@/components/Footer';
import TestimonialsSection from '@/components/TestimonialsSection';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { ArrowRight, Star } from 'lucide-react';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to section based on hash
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Feature Details Section */}
        <section className="py-16 bg-primary/5">
          <Container>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Explore Our Features in Detail</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn more about our powerful tools designed to enhance your content creation process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "AI Humanizer",
                  description: "Transform AI-generated content to pass as human-written",
                  path: "/features/humanizer"
                },
                {
                  title: "AI Writer",
                  description: "Generate papers with proper citations and references",
                  path: "/features/ai-writer"
                },
                {
                  title: "AI Detector",
                  description: "Check if your content will be flagged as AI-generated",
                  path: "/features/ai-detector"
                },
                {
                  title: "Quick Export",
                  description: "Export your content to multiple formats with ease",
                  path: "/features/export"
                },
                {
                  title: "Testimonials",
                  description: "See what our users are saying about our platform",
                  path: "/testimonials",
                  icon: <Star className="w-4 h-4 text-yellow-400" />
                }
              ].map((feature, index) => (
                <div key={index} className="bg-background rounded-xl border border-border/40 p-6 flex flex-col h-full">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    {feature.title} {feature.icon}
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{feature.description}</p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={feature.path}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </section>
        
        <HumanizerTool />
        <TestimonialsSection />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
