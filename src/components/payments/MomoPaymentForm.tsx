
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentFormData, processMomoPayment, verifyMomoPayment } from "@/services/payment";
import { useToast } from "@/hooks/use-toast";
import { QrCode } from "lucide-react";

interface MomoPaymentFormProps {
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
  planId: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const MomoPaymentForm = ({
  onSuccess,
  onError,
  planId,
  loading,
  setLoading
}: MomoPaymentFormProps) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(false);

  const generateQrCode = async () => {
    setLoading(true);
    
    try {
      const paymentData: PaymentFormData = {
        paymentMethod: "momo",
        planId: planId,
        customerEmail: "", // In a real app, get this from user context
        customerName: "",
      };
      
      const result = await processMomoPayment(paymentData);
      
      if (result.success && result.qrCodeUrl) {
        setQrCodeUrl(result.qrCodeUrl);
        setPaymentId("mock-payment-id-" + Date.now()); // This would come from MoMo API in real implementation
      } else {
        toast({
          title: "Failed to generate QR code",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        });
        onError(result.error || "Failed to generate QR code");
      }
    } catch (error) {
      console.error("MoMo error:", error);
      toast({
        title: "MoMo error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      onError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentId) return;
    
    setLoading(true);
    setVerificationStep(true);
    
    try {
      const result = await verifyMomoPayment(paymentId);
      
      if (result.success && result.subscriptionId) {
        toast({
          title: "Payment verified",
          description: "Your subscription has been activated.",
        });
        onSuccess(result.subscriptionId);
      } else {
        toast({
          title: "Verification failed",
          description: result.error || "Could not verify your payment",
          variant: "destructive",
        });
        onError(result.error || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification error",
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
        <div className="space-y-6 text-center">
          {!qrCodeUrl ? (
            <>
              <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <QrCode className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">MoMo Payment</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use MoMo to pay for your subscription
                </p>
              </div>
              
              <Button 
                onClick={generateQrCode} 
                className="w-full bg-[#AF297E] hover:bg-[#9D2471]"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <img 
                  src={qrCodeUrl} 
                  alt="MoMo QR Code" 
                  className="h-48 w-48 border rounded-md p-2"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Scan with MoMo App</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Open your MoMo app, scan this QR code and complete the payment
                </p>
              </div>
              
              {!verificationStep ? (
                <Button 
                  onClick={verifyPayment} 
                  className="w-full bg-[#AF297E] hover:bg-[#9D2471]"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "I've completed payment"}
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground animate-pulse">
                  Verifying your payment...
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MomoPaymentForm;
