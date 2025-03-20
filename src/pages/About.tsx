
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import { useEffect, useRef } from 'react';

const AboutFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="flex gap-6">
      <div className="bg-primary/10 p-3 rounded-lg h-fit">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const About = () => {
  // Update the type to allow any HTML element instead of specifically HTMLDivElement
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-16 md:py-24 px-6">
          <div 
            ref={(el) => {
              if (el) sectionRefs.current[0] = el;
            }}
            className="container max-w-6xl mx-auto opacity-0"
          >
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-primary">HumanizeAI</span></h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're building the future of content creation by making AI-generated text indistinguishable from human writing.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
                <p className="text-lg mb-6">
                  HumanizeAI was founded with a simple mission: to help people leverage the power of AI while maintaining the authenticity of human expression.
                </p>
                <p className="text-lg mb-8">
                  We believe that AI should enhance human creativity, not replace it. Our platform gives you the best of both worlds - the efficiency of AI with the nuance and originality of human writing.
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Learn More About Our Technology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-primary/20 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative aspect-video bg-gradient-to-br from-white to-white/90 dark:from-gray-900 dark:to-gray-800/90 rounded-2xl overflow-hidden shadow-premium">
                  <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
                  <div className="flex items-center justify-center h-full p-8">
                    <div className="relative w-20 h-20 bg-primary rounded-2xl overflow-hidden flex items-center justify-center shadow-glow">
                      <div className="absolute w-full h-full bg-primary animate-pulse-light"></div>
                      <span className="relative text-white font-bold text-4xl">H</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section 
          ref={(el) => {
            if (el) sectionRefs.current[1] = el;
          }}
          className="py-16 bg-secondary/50 px-6 opacity-0"
        >
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold mb-12 text-center">Why Choose HumanizeAI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <AboutFeature 
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Undetectable by AI Tools"
                description="Our advanced algorithms ensure that your content passes through all major AI detection tools including GPTZero, TurnItIn, and more."
              />
              <AboutFeature 
                icon={<RefreshCw className="h-6 w-6 text-primary" />}
                title="Maintains Original Meaning"
                description="Unlike simple paraphrasers, our technology preserves the core meaning and intent of your content while making it uniquely human."
              />
              <AboutFeature 
                icon={<Zap className="h-6 w-6 text-primary" />}
                title="Lightning Fast Processing"
                description="Get results in seconds, not minutes. Our platform is optimized for speed without compromising on quality."
              />
              <AboutFeature 
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title="99.8% Success Rate"
                description="Our technology has been tested extensively with a 99.8% success rate in bypassing AI detection across all major platforms."
              />
            </div>
          </div>
        </section>
        
        <section 
          ref={(el) => {
            if (el) sectionRefs.current[2] = el;
          }}
          className="py-16 md:py-24 px-6 opacity-0"
        >
          <div className="container max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-6">Ready to transform your content?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students, professionals, and content creators who trust HumanizeAI for their content needs.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
