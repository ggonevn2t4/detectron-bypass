
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
