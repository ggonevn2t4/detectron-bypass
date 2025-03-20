
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Signal, Copy, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const confidenceIcon = (confidence: string) => {
    return <Signal className={cn("h-4 w-4", getConfidenceColor(confidence))} />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Analysis Results</h3>
        {confidence && (
          <div className="flex items-center gap-1 text-sm">
            {confidenceIcon(confidence)}
            <span className="capitalize">{confidence} confidence</span>
          </div>
        )}
      </div>

      <Card className="bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {score !== null ? (
              <span className={getScoreColor(score)}>
                {score}% AI Probability
              </span>
            ) : (
              "Waiting for analysis..."
            )}
          </CardTitle>
          <CardDescription>
            {score !== null ? (
              score >= 80 ? (
                "This text was very likely written by AI"
              ) : score >= 60 ? (
                "This text shows some AI characteristics"
              ) : (
                "This text appears to be human-written"
              )
            ) : (
              "Enter text and click analyze to begin"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {score !== null && (
            <>
              <Progress 
                value={score} 
                className="h-2 mb-4" 
              />
              
              <div className="prose prose-sm max-w-none">
                <h4 className="text-sm font-medium mb-2">Detailed Analysis:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {analysis}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onCopy(analysis)}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => onDownload(analysis, 'ai-analysis.txt')}
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download Report
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectorOutput;
