
import React, { useState } from 'react';
import HumanizerInput from './HumanizerInput';
import HumanizerOutput from './HumanizerOutput';
import TextComparison from './TextComparison';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Sliders } from 'lucide-react';

interface HumanizerTabContentProps {
  inputText: string;
  outputText: string;
  wordCount: number;
  isProcessing: boolean;
  showAdvancedSettings: boolean;
  humanScore: number | null;
  progressValue: number;
  humanScoreTarget: number;
  humanizationApproach: 'standard' | 'aggressive' | 'ultra';
  autoOptimize: boolean;
  iterations: number;
  writingStyle: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: () => void;
  onToggleSettings: () => void;
  onHumanize: () => void;
  onOptimize: () => void;
  onCopy: (text: string) => void;
  onDownload: (text: string, filename: string) => void;
  setHumanScoreTarget: (value: number) => void;
  setHumanizationApproach: (value: 'standard' | 'aggressive' | 'ultra') => void;
  setAutoOptimize: (value: boolean) => void;
  setIterations: (value: number) => void;
  setWritingStyle: (value: string) => void;
}

const HumanizerTabContent: React.FC<HumanizerTabContentProps> = ({
  inputText,
  outputText,
  wordCount,
  isProcessing,
  showAdvancedSettings,
  humanScore,
  progressValue,
  humanScoreTarget,
  humanizationApproach,
  autoOptimize,
  iterations,
  writingStyle,
  onInputChange,
  onSampleText,
  onToggleSettings,
  onHumanize,
  onOptimize,
  onCopy,
  onDownload,
  setHumanScoreTarget,
  setHumanizationApproach,
  setAutoOptimize,
  setIterations,
  setWritingStyle
}) => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <HumanizerInput 
          inputText={inputText}
          wordCount={wordCount}
          isProcessing={isProcessing}
          showAdvancedSettings={showAdvancedSettings}
          onInputChange={onInputChange}
          onSampleText={onSampleText}
          onToggleSettings={onToggleSettings}
          onHumanize={onHumanize}
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
        
        <HumanizerOutput 
          outputText={outputText}
          humanScore={humanScore}
          isProcessing={isProcessing}
          progressValue={progressValue}
          onCopy={onCopy}
          onDownload={onDownload}
          onOptimize={onOptimize}
        />
      </div>
      
      {(inputText && outputText) && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Công cụ phân tích nâng cao</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center"
            >
              {showComparison ? (
                <>
                  <Sliders className="mr-2 h-4 w-4" />
                  Ẩn phân tích
                </>
              ) : (
                <>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  So sánh & Phân tích
                </>
              )}
            </Button>
          </div>
          
          {showComparison && (
            <TextComparison 
              originalText={inputText}
              humanizedText={outputText}
              humanScore={humanScore}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HumanizerTabContent;
