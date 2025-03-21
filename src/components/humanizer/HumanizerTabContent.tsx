
import React from 'react';
import HumanizerInput from './HumanizerInput';
import HumanizerOutput from './HumanizerOutput';

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
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default HumanizerTabContent;
