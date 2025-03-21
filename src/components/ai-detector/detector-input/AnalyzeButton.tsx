
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

interface AnalyzeButtonProps {
  isProcessing: boolean;
  disabled: boolean;
  onAnalyze: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ isProcessing, disabled, onAnalyze }) => {
  return (
    <div className="mt-4">
      <Button
        onClick={onAnalyze}
        disabled={disabled}
        className="bg-primary hover:bg-primary/90 w-full font-medium"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Analyzing...
          </>
        ) : (
          <>
            <Activity className="mr-2 h-4 w-4" />
            Analyze Text
          </>
        )}
      </Button>
    </div>
  );
};

export default AnalyzeButton;
