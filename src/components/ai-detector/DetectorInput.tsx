
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Info, Activity } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DetectorInputProps {
  inputText: string;
  wordCount: number;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: () => void;
  onAnalyze: () => void;
}

const DetectorInput: React.FC<DetectorInputProps> = ({
  inputText,
  wordCount,
  isProcessing,
  onInputChange,
  onSampleText,
  onAnalyze,
}) => {
  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Text to Analyze</h3>
        <Badge variant="info" className="px-3 py-1">
          <span className="font-medium">{wordCount} words</span>
        </Badge>
      </div>
      
      <div className="relative group">
        <Textarea 
          placeholder="Paste your text here to analyze..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60 focus:border-primary/40 transition-all duration-300"
          value={inputText}
          onChange={onInputChange}
        />
      </div>
      
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-medium border-border/60 hover:bg-muted/80"
          onClick={onSampleText}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5" />
          Sample Text
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:bg-muted/80">
              <Info className="mr-1.5 h-3.5 w-3.5" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Use text with at least 50 words for better accuracy</li>
                <li>Include both simple and complex sentences</li>
                <li>Text samples between 200-1000 words work best</li>
                <li>Make sure to include proper punctuation</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mt-4">
        <Button
          onClick={onAnalyze}
          disabled={!inputText.trim() || isProcessing}
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
    </Card>
  );
};

export default DetectorInput;
