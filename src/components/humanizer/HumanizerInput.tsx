
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, InfoIcon, Settings, Sparkles, RefreshCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AdvancedSettings from './AdvancedSettings';

interface HumanizerInputProps {
  inputText: string;
  wordCount: number;
  isProcessing: boolean;
  showAdvancedSettings: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: () => void;
  onToggleSettings: () => void;
  onHumanize: () => void;
  humanScoreTarget: number;
  setHumanScoreTarget: (value: number) => void;
  humanizationApproach: 'standard' | 'aggressive' | 'ultra';
  setHumanizationApproach: (value: 'standard' | 'aggressive' | 'ultra') => void;
  autoOptimize: boolean;
  setAutoOptimize: (value: boolean) => void;
  iterations: number;
  setIterations: (value: number) => void;
  writingStyle: string;
  setWritingStyle: (value: string) => void;
}

const HumanizerInput: React.FC<HumanizerInputProps> = ({
  inputText,
  wordCount,
  isProcessing,
  showAdvancedSettings,
  onInputChange,
  onSampleText,
  onToggleSettings,
  onHumanize,
  humanScoreTarget,
  setHumanScoreTarget,
  humanizationApproach,
  setHumanizationApproach,
  autoOptimize,
  setAutoOptimize,
  iterations,
  setIterations,
  writingStyle,
  setWritingStyle
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">AI-Generated Text</h3>
        <span className="text-sm text-muted-foreground">{wordCount} words</span>
      </div>
      <div className="relative">
        <Textarea 
          placeholder="Paste your AI-generated content here..."
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
              <InfoIcon className="mr-2 h-3 w-3" />
              Tips
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Tips for best results:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Use text with at least 50 words for better results</li>
                <li>For extremely human scores, run multiple iterations</li>
                <li>Smaller chunks of text (200-500 words) work best</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center ml-auto">
          <Button
            variant={showAdvancedSettings ? "secondary" : "ghost"}
            size="sm"
            className="text-xs flex items-center"
            onClick={onToggleSettings}
          >
            <Settings className="h-3 w-3 mr-1" />
            {showAdvancedSettings ? "Hide Settings" : "Advanced Settings"}
          </Button>
        </div>
      </div>
      
      <AdvancedSettings
        showAdvancedSettings={showAdvancedSettings}
        humanScoreTarget={humanScoreTarget}
        setHumanScoreTarget={setHumanScoreTarget}
        humanizationApproach={humanizationApproach}
        setHumanizationApproach={setHumanizationApproach}
        autoOptimize={autoOptimize}
        setAutoOptimize={setAutoOptimize}
        iterations={iterations}
        setIterations={setIterations}
        writingStyle={writingStyle}
        setWritingStyle={setWritingStyle}
      />
      
      <div className="mt-4">
        <Button
          onClick={onHumanize}
          disabled={!inputText.trim() || isProcessing}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Humanizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Humanize Text
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default HumanizerInput;
