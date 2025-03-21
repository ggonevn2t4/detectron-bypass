
import { useState } from 'react';
import { SampleContent } from '../SampleContents';

interface UseDetectorInputActionsProps {
  inputText: string;
  setInputText: (text: string) => void;
  setWordCount: (count: number) => void;
  setDetectionResult: (result: any | null) => void;
  toast: any;
  setError?: (error: string | null) => void;
}

export const useDetectorInputActions = ({
  inputText,
  setInputText,
  setWordCount,
  setDetectionResult,
  toast,
  setError
}: UseDetectorInputActionsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
    setDetectionResult(null);
    setError && setError(null);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleSampleText = (sampleText: string) => {
    setInputText(sampleText);
    updateWordCount(sampleText);
    setError && setError(null);
  };

  const handleSampleContent = (sample: SampleContent) => {
    setInputText(sample.content);
    updateWordCount(sample.content);
    setError && setError(null);
    
    toast({
      title: `Mẫu "${sample.title}" đã được tải`,
      description: `Đã chọn mẫu từ danh mục ${sample.category}`,
    });
  };

  return {
    handleInputChange,
    updateWordCount,
    handleSampleText,
    handleSampleContent
  };
};
