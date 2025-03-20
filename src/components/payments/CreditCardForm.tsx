
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentFormData, processCreditCardPayment } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";

interface CreditCardFormProps {
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
  planId: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const CreditCardForm = ({
  onSuccess,
  onError,
  planId,
  loading,
  setLoading
}: CreditCardFormProps) => {
  const { toast } = useToast();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardDetails.cardNumber || !cardDetails.cardholderName || !cardDetails.expiryDate || !cardDetails.cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const paymentData: PaymentFormData = {
        paymentMethod: "credit_card",
        planId: planId,
        customerEmail: "", // In a real app, get this from user context
        customerName: cardDetails.cardholderName,
        billingDetails: {
          cardNumber: cardDetails.cardNumber,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
        },
      };
      
      const result = await processCreditCardPayment(paymentData);
      
      if (result.success && result.subscriptionId) {
        toast({
          title: "Payment successful",
          description: "Your subscription has been activated.",
        });
        onSuccess(result.subscriptionId);
      } else {
        toast({
          title: "Payment failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
        onError(result.error || "Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      onError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              placeholder="John Doe"
              value={cardDetails.cardholderName}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditCardForm;
