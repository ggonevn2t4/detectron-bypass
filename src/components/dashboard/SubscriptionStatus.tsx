
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Check } from 'lucide-react';

interface SubscriptionStatusProps {
  loading: boolean;
}

export function SubscriptionStatus({ loading }: SubscriptionStatusProps) {
  // Mock subscription data - in a real app, this would come from your API
  const subscription = {
    plan: 'Pro',
    status: 'active',
    renewalDate: '2024-12-15',
    features: ['Unlimited projects', 'API access', 'Priority support', 'Team collaboration']
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          Your current plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                {subscription.plan}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Status: <span className="text-green-600 font-medium">{subscription.status}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Next billing date: {subscription.renewalDate}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Included in your plan:</p>
              <ul className="space-y-1">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}
