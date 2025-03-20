
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';

interface HumanizerOutputProps {
  outputText: string;
  humanScore: number | null;
  isProcessing: boolean;
  progressValue: number;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  onOptimize: () => void;
}

const HumanizerOutput: React.FC<HumanizerOutputProps> = ({
  outputText,
  humanScore,
  isProcessing,
  progressValue,
  onCopy,
  onDownload,
  onOptimize
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    onCopy(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Humanized Result</h3>
        {humanScore !== null && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
            humanScore >= 95 
              ? 'bg-green-500/20 text-green-600' 
              : humanScore >= 90
              ? 'bg-green-500/10 text-green-600'
              : 'bg-yellow-500/10 text-yellow-600'
          }`}>
            {humanScore >= 95 ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                {humanScore}% Human
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                {humanScore}% Human
              </>
            )}
          </div>
        )}
      </div>
      
      {isProcessing && (
        <div className="mb-3">
          <Progress value={progressValue} className="h-1" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {progressValue < 30 
              ? 'Analyzing text...' 
              : progressValue < 60
              ? 'Applying humanization...'
              : progressValue < 95
              ? 'Finalizing changes...'
              : 'Complete!'}
          </p>
        </div>
      )}
      
      <div className="relative">
        <Textarea 
          placeholder="Your humanized content will appear here..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/10"
          value={outputText}
          readOnly
        />
        {outputText && (
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex">
        <Button
          variant="outline"
          className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
          disabled={!outputText}
          onClick={() => onDownload(outputText, 'humanized-text.txt')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        
        {outputText && (
          <Button
            variant="ghost"
            className="ml-auto text-muted-foreground hover:text-foreground"
            onClick={onOptimize}
          >
            Click Optimize for a higher score
          </Button>
        )}
      </div>
    </div>
  );
};

export default HumanizerOutput;
