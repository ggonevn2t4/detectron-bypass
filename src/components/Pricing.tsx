
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

type PlanProps = {
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  delay: number;
  billingText: string;
};

const PricingCard = ({ 
  name, 
  price, 
  originalPrice, 
  description, 
  features, 
  buttonText, 
  popular = false, 
  delay, 
  billingText 
}: PlanProps) => {
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
      className={cn(
        "flex flex-col h-full rounded-2xl p-8 shadow-card border border-border/40 transition-all duration-500 transform translate-y-8 opacity-0 hover:shadow-premium",
        popular ? "relative bg-gradient-to-b from-primary/5 to-transparent border-primary/30" : "bg-white dark:bg-gray-800"
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm h-12">{description}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-end">
          {originalPrice && (
            <span className="text-2xl text-muted-foreground line-through mr-2">{originalPrice}</span>
          )}
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2 mb-1">/ month</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {billingText}
        </div>
      </div>
      <div className="flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-3" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        className={cn(
          "w-full",
          popular
            ? "bg-primary hover:bg-primary/90"
            : "bg-secondary hover:bg-secondary/90 text-foreground"
        )}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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
            } else if (entry.target === bannerRef.current) {
              setTimeout(() => {
                entry.target.classList.add('translate-y-0', 'opacity-100');
              }, 100);
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
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
      if (subtitleRef.current) {
        observer.unobserve(subtitleRef.current);
      }
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  // Calculate pro price with 20% discount compared to the reference image
  const monthlyPrice = {
    original: '$16.24',
    discounted: '$9.99'  // 20% less than $12.99
  };
  
  const yearlyPrice = {
    original: '$155.88',
    discounted: '$119.88'  // roughly 20% less
  };

  const freePlan = {
    name: "Free",
    price: "$0",
    description: "Basic humanization for occasional use",
    buttonText: "Start Free Trial",
    features: [
      "550 AI Humanization words",
      "3 Content Generation Credits",
      "Limited usage of AI tools",
      "Upgrade early any time during trial",
      "Basic AI Detection Bypass"
    ],
    delay: 300,
    billingText: `billed as ${yearlyPrice.original} / year after trial`
  };

  const proPlan = {
    name: "Pro",
    price: billingCycle === 'monthly' ? monthlyPrice.discounted : '$8.49',
    originalPrice: billingCycle === 'monthly' ? monthlyPrice.original : undefined,
    description: "Perfect for students and content creators",
    buttonText: "Upgrade Plan",
    popular: true,
    features: [
      "Unlimited AI Humanizations",
      "15 AI Writer Generations / month",
      "2,500 words per process",
      "Advanced AI Detection Bypass",
      "Watermark and future proof",
      "Beta access to new AI tools"
    ],
    delay: 500,
    billingText: billingCycle === 'monthly' 
      ? `billed as ${yearlyPrice.discounted} annually` 
      : 'billed annually'
  };

  return (
    <section id="pricing" ref={sectionRef} className="relative pt-16 pb-32 section">
      {/* Promotional Banner */}
      <div 
        ref={bannerRef} 
        className="w-full bg-primary text-white py-3 px-4 text-center mb-12 transition-all duration-700 transform translate-y-8 opacity-0"
      >
        <span className="font-medium">
          Back to School Special! - 🍎 📚 Save up to 45%! Don't miss out – offer ends April 2.
        </span>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
      </div>

      <div className="container max-w-6xl mx-auto px-6">
        <h2 
          ref={titleRef}
          className="text-center text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 transform translate-y-8 opacity-0"
        >
          Simple, Transparent <span className="text-primary">Pricing</span>
        </h2>
        <p 
          ref={subtitleRef}
          className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-8 transition-all duration-700 transform translate-y-8 opacity-0"
        >
          Choose the plan that fits your needs. All plans include core humanization features.
        </p>

        <div className="flex justify-center mb-12">
          <div className="bg-secondary rounded-full p-1 inline-flex">
            <button
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                billingCycle === 'monthly'
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                billingCycle === 'annual'
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="text-primary">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          <PricingCard {...freePlan} />
          <PricingCard {...proPlan} />
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Need a custom plan for your enterprise?</p>
          <Button variant="outline" className="border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
