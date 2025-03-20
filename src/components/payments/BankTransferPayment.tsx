
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankTransferPaymentProps {
  amount: number;
  planId: string;
  onPaymentComplete: (paymentMethod: string) => void;
}

export function BankTransferPayment({ amount, planId, onPaymentComplete }: BankTransferPaymentProps) {
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Bank account details
  const bankDetails = {
    bankName: 'MB Bank',
    accountNumber: '8873333333',
    accountHolder: 'Cao Nhật Quang',
    transferCode: `ORDER-${planId}-${Date.now().toString().slice(-6)}`
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copied to clipboard',
      description: 'The bank information has been copied to your clipboard.'
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = () => {
    if (!transactionId) {
      toast({
        title: 'Transaction ID required',
        description: 'Please enter your transaction ID to verify your payment.',
        variant: 'destructive'
      });
      return;
    }

    // In a real application, you would validate the transaction here
    // For now, we'll just simulate a successful payment
    toast({
      title: 'Payment information submitted',
      description: 'We will verify your payment and activate your subscription shortly.',
    });

    onPaymentComplete('bank_transfer');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bank Transfer</CardTitle>
        <CardDescription>
          Make a bank transfer to the following account and enter your transaction ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Bank Name</p>
            <p className="text-sm">{bankDetails.bankName}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Account Number</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm">{bankDetails.accountNumber}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => handleCopy(bankDetails.accountNumber)}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Account Holder</p>
            <p className="text-sm">{bankDetails.accountHolder}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Amount</p>
            <p className="text-sm font-bold">{amount.toLocaleString('vi-VN')} VND</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Transfer Code</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-mono">{bankDetails.transferCode}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => handleCopy(bankDetails.transferCode)}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Please include the transfer code in your payment reference so we can verify your payment.
          </p>
          <Input
            placeholder="Enter your transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          Confirm Payment
        </Button>
      </CardFooter>
    </Card>
  );
}
