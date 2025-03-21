
import React from 'react';
import { Card } from '@/components/ui/card';
import { SampleContent } from './SampleContents';
import InputHeader from './detector-input/InputHeader';
import TextInput from './detector-input/TextInput';
import InputActionButtons from './detector-input/InputActionButtons';
import ContentSamplesDropdown from './detector-input/ContentSamplesDropdown';
import AnalyzeButton from './detector-input/AnalyzeButton';

interface DetectorInputProps {
  inputText: string;
  wordCount: number;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSampleText: () => void;
  onSampleContent: (sample: SampleContent) => void;
  onAnalyze: () => void;
  sampleContents: SampleContent[];
}

const DetectorInput: React.FC<DetectorInputProps> = ({
  inputText,
  wordCount,
  isProcessing,
  onInputChange,
  onSampleText,
  onSampleContent,
  onAnalyze,
  sampleContents
}) => {
  return (
    <Card className="p-5 border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md">
      <InputHeader wordCount={wordCount} />
      
      <TextInput 
        inputText={inputText}
        onInputChange={onInputChange}
      />
      
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <InputActionButtons onSampleText={onSampleText} />
        
        <ContentSamplesDropdown 
          sampleContents={sampleContents}
          onSampleContent={onSampleContent}
        />
      </div>
      
      <AnalyzeButton 
        isProcessing={isProcessing}
        disabled={!inputText.trim() || isProcessing}
        onAnalyze={onAnalyze}
      />
    </Card>
  );
};

export default DetectorInput;
