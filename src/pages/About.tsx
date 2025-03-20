
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, RefreshCw, Zap, BarChart3 } from 'lucide-react';
import { Container } from '@/components/ui/container';

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
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 px-6">
          <Container className="max-w-6xl">
            <div className="text-center mb-12">
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
                <div className="relative bg-gradient-to-br from-white to-white/90 dark:from-gray-900 dark:to-gray-800/90 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-center h-full p-8 aspect-video">
                    <div className="relative w-20 h-20 bg-primary rounded-2xl overflow-hidden flex items-center justify-center">
                      <span className="relative text-white font-bold text-4xl">H</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
        
        <section className="py-12 bg-secondary/50 px-6">
          <Container className="max-w-6xl">
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
          </Container>
        </section>
        
        <section className="py-12 md:py-16 px-6">
          <Container className="max-w-6xl text-center">
            <h2 className="text-3xl font-semibold mb-6">Ready to transform your content?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students, professionals, and content creators who trust HumanizeAI for their content needs.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
