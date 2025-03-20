
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PaymentMethodSelector from "./PaymentMethodSelector";
import { getSubscriptionPlans, PlanDetails } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface SubscriptionCheckoutProps {
  planId?: string;
}

const SubscriptionCheckout = ({ planId = "monthly-pro" }: SubscriptionCheckoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"plan-selection" | "payment" | "success">("plan-selection");
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [plans, setPlans] = useState<PlanDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  
  useState(() => {
    const loadPlans = async () => {
      try {
        const availablePlans = await getSubscriptionPlans();
        setPlans(availablePlans);
        
        // Set the selected plan based on planId prop or default to first plan
        const initialPlan = availablePlans.find(p => p.id === planId) || availablePlans[0];
        setSelectedPlan(initialPlan);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading plans:", error);
        setError("Failed to load subscription plans");
        setLoading(false);
      }
    };
    
    loadPlans();
  });
  
  const handlePlanSelect = (plan: PlanDetails) => {
    setSelectedPlan(plan);
  };
  
  const handleContinueToPayment = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to continue with your purchase",
        variant: "destructive",
      });
      navigate("/auth?redirect=subscription");
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: "Select a plan",
        description: "Please select a subscription plan",
        variant: "destructive",
      });
      return;
    }
    
    setStep("payment");
  };
  
  const handlePaymentSuccess = (newSubscriptionId: string) => {
    setSubscriptionId(newSubscriptionId);
    setStep("success");
  };
  
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    // We'll stay on the payment step and let the user try again
  };
  
  const handleGoBack = () => {
    setError(null);
    if (step === "payment") {
      setStep("plan-selection");
    } else if (step === "success") {
      navigate("/dashboard");
    }
  };
  
  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Loading Subscription Options</CardTitle>
            <CardDescription>Please wait while we load available plans...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error && step !== "payment") {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto py-8">
      {step === "plan-selection" && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Subscription Plan</CardTitle>
            <CardDescription>Select a plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleContinueToPayment}
              disabled={!selectedPlan}
            >
              Continue to Payment
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === "payment" && selectedPlan && (
        <>
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-xl font-bold">Payment</h2>
          </div>
          
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{selectedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">${selectedPlan.price}</span>
                    <span className="text-sm text-muted-foreground">/{selectedPlan.interval}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedPlan.price}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <PaymentMethodSelector
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            planId={selectedPlan.id}
          />
        </>
      )}
      
      {step === "success" && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-2">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your subscription has been activated successfully.
            </p>
            
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionCheckout;
