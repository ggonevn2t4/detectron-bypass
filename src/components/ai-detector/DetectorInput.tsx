
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Text to Analyze</h3>
        <span className="text-sm text-muted-foreground">{wordCount} words</span>
      </div>
      
      <div className="relative">
        <Textarea 
          placeholder="Paste your text here to analyze..."
          className="min-h-[280px] resize-none p-4 text-base border-border/60"
          value={inputText}
          onChange={onInputChange}
        />
      </div>
      
      <div className="flex items-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={onSampleText}
        >
          <FileText className="mr-2 h-3 w-3" />
          Sample Text
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Info className="mr-2 h-3 w-3" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Use text with at least 50 words for better accuracy</li>
                <li>Include both simple and complex sentences</li>
                <li>Text samples between 200-1000 words work best</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="mt-4">
        <Button
          onClick={onAnalyze}
          disabled={!inputText.trim() || isProcessing}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          {isProcessing ? (
            "Analyzing..."
          ) : (
            "Analyze Text"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DetectorInput;
