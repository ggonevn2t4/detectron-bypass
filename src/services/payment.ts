
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = "credit_card" | "momo";

export interface PlanDetails {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
}

export interface PaymentFormData {
  paymentMethod: PaymentMethod;
  planId: string;
  customerEmail: string;
  customerName: string;
  billingDetails?: any;
}

// Mock function to process credit card payments
export const processCreditCardPayment = async (paymentData: PaymentFormData): Promise<{success: boolean, subscriptionId?: string, error?: string}> => {
  console.log("Processing credit card payment:", paymentData);
  
  // In a real implementation, this would call your payment processor API
  // For now, we'll simulate a successful payment most of the time
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Success 90% of the time in this mock implementation
  const success = Math.random() > 0.1;
  
  if (success) {
    // Mock subscription creation
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          plan_id: paymentData.planId,
          payment_method: paymentData.paymentMethod,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
        }
      ] as any)
      .select();
    
    if (error) {
      console.error("Error creating subscription:", error);
      return { success: false, error: "Failed to create subscription record" };
    }
    
    return { 
      success: true, 
      subscriptionId: data?.[0]?.id 
    };
  }
  
  return { 
    success: false, 
    error: "Payment processing failed. Please try again or contact support." 
  };
};

// Process MoMo payments
export const processMomoPayment = async (paymentData: PaymentFormData): Promise<{success: boolean, qrCodeUrl?: string, error?: string}> => {
  console.log("Processing MoMo payment:", paymentData);
  
  // In a real implementation, this would call the MoMo API to generate a payment request
  // For now, we'll simulate it
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Success 90% of the time in this mock implementation
  const success = Math.random() > 0.1;
  
  if (success) {
    // Mock QR code URL - this would be provided by the MoMo API in a real implementation
    const qrCodeUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg";
    
    return { 
      success: true, 
      qrCodeUrl
    };
  }
  
  return { 
    success: false, 
    error: "Failed to generate MoMo payment QR code. Please try again." 
  };
};

// Get available subscription plans
export const getSubscriptionPlans = async (): Promise<PlanDetails[]> => {
  // In a real app, you would fetch this from your database
  return [
    {
      id: "monthly-pro",
      name: "Pro Monthly",
      price: 9.99,
      interval: "month",
      description: "Monthly Pro subscription"
    },
    {
      id: "yearly-pro",
      name: "Pro Yearly",
      price: 99.99,
      interval: "year",
      description: "Yearly Pro subscription (Save 17%)"
    }
  ];
};

// Verify MoMo payment status
export const verifyMomoPayment = async (paymentId: string): Promise<{success: boolean, subscriptionId?: string, error?: string}> => {
  console.log("Verifying MoMo payment:", paymentId);
  
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would check the payment status with MoMo
  // and then create a subscription if successful
  
  // For demo purposes, always succeed
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        plan_id: "monthly-pro", // Default to monthly for the mock
        payment_method: "momo",
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
      }
    ] as any)
    .select();
  
  if (error) {
    console.error("Error creating subscription:", error);
    return { success: false, error: "Failed to create subscription record" };
  }
  
  return { 
    success: true, 
    subscriptionId: data?.[0]?.id 
  };
};
