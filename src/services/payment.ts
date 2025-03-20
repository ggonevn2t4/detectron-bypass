
import { supabase } from '@/integrations/supabase/client';

export type PaymentMethod = 'credit_card' | 'momo' | 'bank_transfer';

export interface PaymentDetails {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  transactionId?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

// Demo subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99000,
    description: 'Perfect for individual users',
    features: [
      'Full access to basic features',
      'Priority support',
      'Up to 10 projects',
      'API access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299000,
    description: 'Ideal for professionals and teams',
    features: [
      'All Basic features',
      'Unlimited projects',
      'Premium support',
      'Team collaboration',
      'Advanced analytics'
    ],
    popular: true
  }
];

// Process subscription for bank transfer
export const processSubscription = async (
  userId: string,
  planId: string,
  paymentMethod: PaymentMethod
) => {
  try {
    // Generate end date (30 days from now)
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);
    
    // Create subscription record in the database
    const { data, error } = await supabase
      .from('subscriptions' as any)
      .insert([
        {
          user_id: userId,
          plan_id: planId,
          payment_method: paymentMethod,
          status: paymentMethod === 'bank_transfer' ? 'pending' : 'active',
          current_period_end: currentPeriodEnd.toISOString(),
        }
      ]);
    
    if (error) {
      console.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in processSubscription:', error);
    throw error;
  }
};

// Mock function to process bank transfer
export const processBankTransfer = async (
  userId: string,
  planId: string,
  amount: number,
  transactionId?: string
) => {
  try {
    console.log(`Processing bank transfer payment for user ${userId}`);
    console.log(`Plan: ${planId}, Amount: ${amount}, Transaction ID: ${transactionId}`);
    
    // In a real application, you would validate the transaction with your bank API
    
    // Create the subscription
    return await processSubscription(userId, planId, 'bank_transfer');
  } catch (error) {
    console.error('Error processing bank transfer:', error);
    throw error;
  }
};

// Mock verification of bank transfer (for admin panel)
export const verifyBankTransfer = async (subscriptionId: string) => {
  try {
    // Update subscription status to active
    const { data, error } = await supabase
      .from('subscriptions' as any)
      .update({ status: 'active' })
      .eq('id', subscriptionId);
      
    if (error) {
      console.error('Error verifying bank transfer:', error);
      throw new Error(`Failed to verify bank transfer: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in verifyBankTransfer:', error);
    throw error;
  }
};

// Create a subscription checkout component
<lov-write file_path="src/components/payments/SubscriptionCheckout.tsx">
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod, SubscriptionPlan, processBankTransfer } from '@/services/payment';
import { BankTransferPayment } from './BankTransferPayment';
import { useNavigate } from 'react-router-dom';

interface SubscriptionCheckoutProps {
  selectedPlan: SubscriptionPlan;
  onCancel: () => void;
}

export function SubscriptionCheckout({ selectedPlan, onCancel }: SubscriptionCheckoutProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentComplete = async (paymentMethod: PaymentMethod) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Process the subscription based on payment method
      if (paymentMethod === 'bank_transfer') {
        await processBankTransfer(user.id, selectedPlan.id, selectedPlan.price);
      }
      
      toast({
        title: 'Subscription created',
        description: paymentMethod === 'bank_transfer' 
          ? 'Your subscription will be activated after payment verification' 
          : 'Your subscription has been activated',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'There was a problem processing your payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Subscribe to {selectedPlan.name} Plan</CardTitle>
        <CardDescription>
          Choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bank_transfer" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="bank_transfer" onClick={() => setSelectedPaymentMethod('bank_transfer')}>
              Bank Transfer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank_transfer" className="mt-4">
            <BankTransferPayment 
              amount={selectedPlan.price} 
              planId={selectedPlan.id}
              onPaymentComplete={handlePaymentComplete}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
