
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlanProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  delay: number;
};

const PricingCard = ({ name, price, description, features, popular = false, delay }: PlanProps) => {
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
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground ml-2 mb-1">/month</span>}
        </div>
      </div>
      <div className="flex-grow">
        <ul className="space-y-3 mb-8">
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
        {popular ? "Get Started" : "Choose Plan"}
      </Button>
    </div>
  );
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
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

  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Basic humanization for occasional use",
      features: [
        "500 words per month",
        "Basic AI detection",
        "Standard support",
        "1 export format"
      ],
      delay: 300
    },
    {
      name: "Pro",
      price: "$29",
      description: "Perfect for students and content creators",
      features: [
        "25,000 words per month",
        "Advanced humanization",
        "Priority support",
        "All export formats",
        "AI detector tool"
      ],
      popular: true,
      delay: 500
    },
    {
      name: "Business",
      price: "$79",
      description: "For professionals and small teams",
      features: [
        "100,000 words per month",
        "Premium humanization",
        "24/7 support",
        "All export formats",
        "API access",
        "Team collaboration"
      ],
      delay: 700
    }
  ];

  return (
    <section id="pricing" ref={sectionRef} className="relative pt-16 pb-32 section">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              price={
                plan.price === "Free"
                  ? "Free"
                  : billingCycle === 'annual'
                    ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}`
                    : plan.price
              }
            />
          ))}
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
