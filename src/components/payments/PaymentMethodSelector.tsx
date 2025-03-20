
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "@/services/payment";
import CreditCardForm from "./CreditCardForm";
import MomoPaymentForm from "./MomoPaymentForm";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentMethodSelectorProps {
  onSuccess: (subscriptionId: string) => void;
  onError: (error: string) => void;
  planId: string;
}

const PaymentMethodSelector = ({
  onSuccess,
  onError,
  planId,
}: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value: string) => setSelectedMethod(value as PaymentMethod)}
            className="space-y-4"
            disabled={loading}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                <div className="bg-secondary/50 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <span>Credit / Debit Card</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo" className="flex items-center gap-2 cursor-pointer">
                <div className="bg-[#AF297E]/10 p-1 rounded">
                  <svg viewBox="0 0 100 100" width="24" height="24" fill="#AF297E">
                    <path d="M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M28.6,40.3c0-4.7,3.8-8.6,8.6-8.6
                      c4.7,0,8.6,3.8,8.6,8.6c0,4.7-3.8,8.6-8.6,8.6C32.4,48.9,28.6,45.1,28.6,40.3z M40.3,71.4c0,0-11.5-13.1-11.5-20.7
                      c0-4.3,2.9-7.9,6.4-7.9c2.5,0,6.4,3,6.4,3s3.9-3,6.4-3c3.5,0,6.4,3.6,6.4,7.9c0,1.2,0.2,3.9-1.9,7.5c-2.1,3.6-9.6,13.2-9.6,13.2
                      C42.9,71.4,40.3,71.4,40.3,71.4z M71.4,48.9c-4.7,0-8.6-3.8-8.6-8.6c0-4.7,3.8-8.6,8.6-8.6c4.7,0,8.6,3.8,8.6,8.6
                      C80,45.1,76.2,48.9,71.4,48.9z"/>
                  </svg>
                </div>
                <span>MoMo</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      {selectedMethod === "credit_card" ? (
        <CreditCardForm 
          onSuccess={onSuccess}
          onError={onError}
          planId={planId}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <MomoPaymentForm
          onSuccess={onSuccess}
          onError={onError}
          planId={planId}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default PaymentMethodSelector;
