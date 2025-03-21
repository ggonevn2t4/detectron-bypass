
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Signal, Copy, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DetectorOutputProps {
  score: number | null;
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
  isProcessing: boolean;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
}

const DetectorOutput: React.FC<DetectorOutputProps> = ({
  score,
  analysis,
  confidence,
  isProcessing,
  onCopy,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    onCopy(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBadgeVariant = (score: number | null) => {
    if (score === null) return "secondary";
    if (score >= 80) return "destructive";
    if (score >= 60) return "warning";
    return "success";
  };

  const confidenceIcon = (confidence: string) => {
    return <Signal className={cn("h-4 w-4", getConfidenceColor(confidence))} />;
  };

  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Analysis Results</h3>
        {confidence && score !== null && (
          <Badge variant={getBadgeVariant(score)} className="flex items-center gap-1 px-3 py-1">
            {confidenceIcon(confidence)}
            <span className="font-medium capitalize">{confidence} confidence</span>
          </Badge>
        )}
      </div>

      {score !== null ? (
        <>
          <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border/40">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">AI Detection Score</h4>
                <span className={cn("text-xl font-bold", getScoreColor(score))}>
                  {score}%
                </span>
              </div>
              <Progress 
                value={score} 
                className="h-2 mb-1" 
              />
              <p className={cn("text-sm font-medium", getScoreColor(score))}>
                {score >= 80 ? (
                  "This text was very likely written by AI"
                ) : score >= 60 ? (
                  "This text shows some AI characteristics"
                ) : (
                  "This text appears to be human-written"
                )}
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="prose prose-sm max-w-none mb-4">
              <h4 className="text-sm font-medium mb-2">Detailed Analysis:</h4>
              <div className="text-sm text-muted-foreground whitespace-pre-line p-4 bg-muted/5 border border-border/40 rounded-md min-h-[180px]">
                {analysis}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Analysis
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-border/60 text-foreground hover:border-primary/40 hover:bg-primary/5 font-medium"
                onClick={() => onDownload(analysis, 'ai-analysis.txt')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium mb-2">No Analysis Yet</h4>
          <p className="text-muted-foreground">
            Enter text and click analyze to see AI detection results
          </p>
        </div>
      )}
    </Card>
  );
};

export default DetectorOutput;
