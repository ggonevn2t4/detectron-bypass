
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatusProps {
  loading?: boolean;
}

export function SubscriptionStatus({ loading: initialLoading = false }: SubscriptionStatusProps) {
  const { user, getSubscriptionStatus } = useAuth();
  const [loading, setLoading] = useState(initialLoading);
  const [subscription, setSubscription] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const data = await getSubscriptionStatus();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch subscription data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user, getSubscriptionStatus, toast]);
  
  // Default features for each plan
  const planFeatures = {
    free: ['Basic access', 'Standard support', 'Limited projects'],
    basic: ['Full access', 'Priority support', 'Up to 10 projects', 'API access'],
    pro: ['Unlimited projects', 'Premium support', 'Team collaboration', 'Advanced analytics', 'API access']
  };

  // Get features based on subscription plan or default to free
  const getFeatures = () => {
    if (!subscription) return planFeatures.free;
    
    switch (subscription.plan_id) {
      case 'basic':
        return planFeatures.basic;
      case 'pro':
        return planFeatures.pro;
      default:
        return planFeatures.free;
    }
  };

  const getPlanName = () => {
    if (!subscription) return 'Free';
    
    switch (subscription.plan_id) {
      case 'basic':
        return 'Basic';
      case 'pro':
        return 'Pro';
      default:
        return 'Free';
    }
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
                {getPlanName()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Status: <span className={`font-medium ${subscription?.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {subscription?.status || 'Free tier'}
                </span>
              </p>
              {subscription?.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
              {subscription?.payment_method && (
                <p className="text-sm text-muted-foreground">
                  Payment method: {subscription.payment_method.replace('_', ' ')}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Included in your plan:</p>
              <ul className="space-y-1">
                {getFeatures().map((feature, index) => (
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
