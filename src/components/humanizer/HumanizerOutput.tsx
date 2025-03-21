
import React, { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Download, Copy, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface HumanizerOutputProps {
  outputText: string;
  humanScore: number | null;
  isProcessing: boolean;
  progressValue: number;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  onOptimize: () => void;
}

// Memoized progress display component
const ProgressDisplay = memo(({ value, message }: { value: number, message: string }) => (
  <div className="mb-4 animate-in fade-in-50 duration-300">
    <Progress value={value} className="h-2 bg-muted/50" />
    <div className="flex justify-between mt-2">
      <p className="text-xs text-muted-foreground">{message}</p>
      <p className="text-xs font-medium">{Math.round(value)}%</p>
    </div>
  </div>
));

// Memoized score badge component
const ScoreBadge = memo(({ score }: { score: number }) => (
  <Badge variant={score >= 95 ? "success" : score >= 90 ? "default" : "secondary"} className="flex items-center gap-1 px-3 py-1.5">
    {score >= 95 ? (
      <CheckCircle className="h-3.5 w-3.5 mr-1" />
    ) : (
      <AlertCircle className="h-3.5 w-3.5 mr-1" />
    )}
    <span className="font-medium">{score}% Human</span>
  </Badge>
));

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

  const getProgressMessage = () => {
    if (progressValue < 30) return 'Phân tích văn bản...';
    if (progressValue < 60) return 'Áp dụng kỹ thuật humanize...';
    if (progressValue < 95) return 'Hoàn thiện thay đổi...';
    return 'Hoàn tất!';
  };

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Nội dung đã Humanize</h3>
        {humanScore !== null && <ScoreBadge score={humanScore} />}
      </div>
      
      {isProcessing && <ProgressDisplay value={progressValue} message={getProgressMessage()} />}
      
      <div className="relative group">
        <Textarea 
          placeholder="Nội dung đã humanize sẽ xuất hiện ở đây..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 bg-muted/5 font-medium transition-all duration-300 focus:border-primary/40 focus:bg-white"
          value={outputText}
          readOnly
        />
        
        {outputText && (
          <div className="absolute bottom-3 right-3 flex space-x-2 bg-background/80 backdrop-blur-sm rounded p-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  Đã sao chép
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Sao chép
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="outline"
          className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
          disabled={!outputText || isProcessing}
          onClick={() => onDownload(outputText, 'humanized-text.txt')}
        >
          <Download className="mr-2 h-4 w-4" />
          Xuất văn bản
        </Button>
        
        {outputText && !isProcessing && (
          <Button
            variant="default"
            className="ml-auto"
            onClick={onOptimize}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tối ưu để đạt điểm cao hơn
          </Button>
        )}
      </div>
    </Card>
  );
};

export default memo(HumanizerOutput);
