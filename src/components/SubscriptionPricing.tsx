
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlan, subscriptionPlans } from '@/services/payment';
import { SubscriptionCheckout } from './payments/SubscriptionCheckout';

export function SubscriptionPricing() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleCancelCheckout = () => {
    setSelectedPlan(null);
  };

  if (selectedPlan) {
    return <SubscriptionCheckout selectedPlan={selectedPlan} onCancel={handleCancelCheckout} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground mt-2">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col ${plan.popular ? 'border-primary shadow-md' : ''}`}
          >
            {plan.popular && (
              <div className="rounded-t-lg bg-primary py-1 text-center text-sm font-medium text-primary-foreground">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price.toLocaleString('vi-VN')}</span>
                <span className="text-muted-foreground ml-1">VND/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSelectPlan(plan)}
                disabled={!user}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {user ? `Subscribe to ${plan.name}` : 'Sign in to Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
