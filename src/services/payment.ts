
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
