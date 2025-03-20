
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Shield, Brain, Workflow, FileSearch } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface FeatureDetailProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  delay?: number;
}

const FeatureDetail = ({ title, description, icon, examples, delay = 0 }: FeatureDetailProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('translate-y-0', 'opacity-100');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <Card 
      ref={cardRef}
      className="transition-all duration-700 transform translate-y-12 opacity-0 hover:shadow-lg"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center mb-2">
          <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-medium mb-2">Examples:</h4>
        <ul className="space-y-2">
          {examples.map((example, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
              <span className="text-sm">{example}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const FeaturesPage = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const pageRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      category: 'ai-detection',
      title: 'Bypass AI Detection',
      description: 'Our advanced AI humanizes your content to avoid detection by AI checkers like Turnitin and GPTZero.',
      icon: <Shield size={24} />,
      examples: [
        'Rewrites AI-generated essays to bypass university detection systems',
        'Transforms GPT outputs to appear human-written for professional use',
        'Preserves your original meaning while adding human-like nuance',
        'Works with academic, professional, and creative content'
      ]
    },
    {
      category: 'humanization',
      title: 'Advanced Text Humanization',
      description: 'Transform AI-generated content into natural, human-like writing that retains your original meaning.',
      icon: <Brain size={24} />,
      examples: [
        'Preserves your writing style while adding human variations',
        'Reduces repetitive patterns common in AI-generated text',
        'Adds natural language imperfections that appear authentic',
        'Maintains your original tone and intent throughout'
      ]
    },
    {
      category: 'workflow',
      title: 'Streamlined Workflow',
      description: 'Integrate our humanization tools into your content creation workflow for seamless productivity.',
      icon: <Workflow size={24} />,
      examples: [
        'Process multiple documents in batch mode',
        'Save favorite humanization settings for quick reuse',
        'Export in multiple formats including Word, PDF, and plain text',
        'Track revision history and compare different versions'
      ]
    },
    {
      category: 'ai-detection',
      title: 'Real-time AI Detection Check',
      description: 'Test your content against multiple AI detection tools to ensure it passes as human-written.',
      icon: <FileSearch size={24} />,
      examples: [
        'Simulates results from GPTZero, Originality.ai, and ZeroGPT',
        'Provides detailed analysis of AI detection weak points',
        'Suggests specific improvements to reduce AI markers',
        'Estimates detection probability percentage for each tool'
      ]
    },
    {
      category: 'performance',
      title: 'Lightning-Fast Processing',
      description: 'Experience rapid humanization with our optimized algorithms built for speed and accuracy.',
      icon: <Zap size={24} />,
      examples: [
        'Humanizes up to 10,000 words in under 60 seconds',
        'Processes large documents without performance degradation',
        'Supports bulk processing of multiple files simultaneously',
        'Optimized resource usage for consistent speed'
      ]
    },
    {
      category: 'humanization',
      title: 'Style Customization',
      description: 'Tailor the humanization process to match specific writing styles, academic levels, or tones.',
      icon: <Brain size={24} />,
      examples: [
        'Adjust formality from casual to academic or professional',
        'Match specific academic levels from high school to postgraduate',
        'Customize tone to be persuasive, informative, or conversational',
        'Select industry-specific terminology and phrasing'
      ]
    }
  ];
  
  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);
  
  const categories = [
    { value: 'all', label: 'All Features' },
    { value: 'humanization', label: 'Humanization' },
    { value: 'ai-detection', label: 'AI Detection' },
    { value: 'workflow', label: 'Workflow' },
    { value: 'performance', label: 'Performance' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 mx-auto" ref={pageRef}>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Detailed Features & Capabilities
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore the full range of powerful tools available to transform your AI content into authentic human writing.
            </p>
          </div>
          
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <div className="flex space-x-2 p-1 bg-muted rounded-lg">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeCategory === category.value
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {filteredFeatures.map((feature, i) => (
              <FeatureDetail
                key={i}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                examples={feature.examples}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
