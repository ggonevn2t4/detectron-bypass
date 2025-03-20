
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const exampleText = [
    "AI-generated content", 
    "GPT-4 text", 
    "ChatGPT essays", 
    "AI-written articles"
  ];
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % exampleText.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 section">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-80 animate-spin-slow"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-6 z-10">
        <div 
          className={`flex flex-col items-center text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-6 bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium">Undetectable AI Content Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight animate-fade-in opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            Transform AI to
            <br />
            <span className="relative">
              <span className="inline-block relative">
                <span className="text-primary relative z-10">100% Human Content</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0 rounded-full transform skew-x-3"></span>
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            Humanize <span className="inline-flex items-center">
              <span className="text-foreground font-medium transition-all duration-300 ease-in-out">{exampleText[currentTextIndex]}</span>
              <span className="ml-1 text-primary">|</span>
            </span> to bypass AI detectors with 99.8% accuracy. Save time on writing and boost your efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
            <Button size="lg" className="text-base font-medium px-8 py-6 bg-primary hover:bg-primary/90 hover:shadow-glow transition-all duration-300">
              Start Humanizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
              Learn More
            </Button>
          </div>
          
          <div className="mt-20 w-full max-w-5xl mx-auto relative animate-fade-in opacity-0" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-white to-white/90 dark:from-gray-900 dark:to-gray-800/90 rounded-2xl p-1 shadow-premium">
              <div className="bg-card rounded-xl overflow-hidden shadow-inner">
                <div className="h-[28rem] w-full rounded-xl bg-secondary relative">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-secondary flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto bg-background/80 rounded-md px-4 py-1 text-xs text-center">
                      humanize.ai - Undetectable AI Content Humanizer
                    </div>
                  </div>
                  
                  <div className="pt-14 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-border overflow-hidden">
                      <h4 className="font-medium mb-2">AI-Generated Content</h4>
                      <div className="h-[calc(100%-2rem)] overflow-y-auto bg-white dark:bg-gray-900 p-3 rounded border text-sm">
                        <p className="mb-2">The rapid advancement of artificial intelligence has led to numerous applications across various industries. Notably, AI-powered tools now enable users to generate high-quality content efficiently.</p>
                        <p className="mb-2">These developments have significant implications for content creation workflows, enabling faster production while maintaining quality standards.</p>
                        <p>However, such technological progress also raises important questions about content originality and authenticity that must be addressed.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Humanized Content</h4>
                        <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full">100% Human</span>
                      </div>
                      <div className="h-[calc(100%-2rem)] overflow-y-auto bg-white dark:bg-gray-900 p-3 rounded border text-sm relative shimmer">
                        <p className="mb-2">As AI continues to evolve at breakneck speed, we're witnessing its transformative impact across countless fields. One particularly striking development is how AI tools now help people craft compelling content in a fraction of the time it once took.</p>
                        <p className="mb-2">These innovations are fundamentally reshaping how organizations approach content development—slashing production timelines while still delivering the quality readers expect.</p>
                        <p>Yet amid this technological revolution, we can't ignore the growing concerns about what constitutes original work and how we maintain authenticity in an increasingly AI-influenced landscape.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
