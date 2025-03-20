
import { CheckCircle, Undo2, FileText, FileCheck, Download } from 'lucide-react';
import { useRef, useEffect } from 'react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
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
      { threshold: 0.2 }
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
    <div
      ref={cardRef}
      className="bg-white dark:bg-gray-800 border border-border/40 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 transform translate-y-8 opacity-0"
    >
      <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === titleRef.current) {
              entry.target.classList.add('translate-y-0', 'opacity-100');
            } else if (entry.target === subtitleRef.current) {
              setTimeout(() => {
                entry.target.classList.add('translate-y-0', 'opacity-100');
              }, 200);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    if (subtitleRef.current) {
      observer.observe(subtitleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
      if (subtitleRef.current) {
        observer.unobserve(subtitleRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Undo2 size={28} />,
      title: "AI Humanizer & Paraphraser",
      description: "Humanize AI-generated content to bypass AI detectors like GPTZero, TurnItIn, and more with 99.8% accuracy.",
      delay: 400,
    },
    {
      icon: <FileText size={28} />,
      title: "AI Writer",
      description: "Organize and generate your next paper, article, or more within seconds, with support for custom in-text citations.",
      delay: 600,
    },
    {
      icon: <FileCheck size={28} />,
      title: "AI Detector",
      description: "Check your content for free to see if it gets picked up by AI detectors with our industry-leading 99.8% accuracy rate.",
      delay: 800,
    },
    {
      icon: <Download size={28} />,
      title: "Quick Export",
      description: "Quickly export your generated content to multiple supported formats including Google Docs, Microsoft Word, and more.",
      delay: 1000,
    },
  ];

  return (
    <section id="features" ref={sectionRef} className="relative py-20 section">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl opacity-70"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-6">
        <h2 
          ref={titleRef}
          className="text-center text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 transform translate-y-8 opacity-0"
        >
          Premium Features Designed for <span className="text-primary">Results</span>
        </h2>
        <p 
          ref={subtitleRef}
          className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-16 transition-all duration-700 transform translate-y-8 opacity-0"
        >
          Our platform offers cutting-edge tools to humanize AI content and boost your productivity with state-of-the-art technology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-border/40 rounded-2xl p-8 shadow-soft">
          <h3 className="text-2xl font-semibold mb-4 text-center">Why Choose HumanizeAI?</h3>
          <div className="space-y-4">
            {[
              "99.8% success rate on bypassing all AI detection tools",
              "Fast processing with results in seconds",
              "Preserves original meaning while making text unique",
              "Unlimited word count for all your content needs",
              "24/7 customer support for any questions",
              "Regular updates to stay ahead of detection algorithms"
            ].map((point, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="text-primary shrink-0 mr-3 mt-1" size={20} />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
