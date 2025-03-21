
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  title?: string;
  message: string;
  retry?: () => void;
}

const ErrorAlert = ({ 
  title = "Đã xảy ra lỗi", 
  message, 
  retry 
}: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">{message}</p>
        {retry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry} 
            className="mt-2 bg-background hover:bg-background/80"
          >
            Thử lại
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
