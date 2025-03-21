
import { useDetectorInputActions } from './useDetectorInputActions';
import { useDetectorAnalysisActions } from './useDetectorAnalysisActions';
import { useDetectorExportActions } from './useDetectorExportActions';
import { useDetectorHistoryActions } from './useDetectorHistoryActions';
import { HistoryItem } from './useDetectorState';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { SampleContent } from '../SampleContents';

interface UseDetectorActionsProps {
  inputText: string;
  setInputText: (text: string) => void;
  setWordCount: (count: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setDetectionResult: (result: AIDetectionResult | null) => void;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  setShowHistory: (show: boolean) => void;
  toast: any;
  setError?: (error: string | null) => void;
}

export const useDetectorActions = (props: UseDetectorActionsProps) => {
  const {
    inputText,
    setInputText,
    setWordCount,
    setIsProcessing,
    setDetectionResult,
    history,
    setHistory,
    setShowHistory,
    toast,
    setError
  } = props;

  // Input related actions
  const { 
    handleInputChange, 
    updateWordCount, 
    handleSampleText, 
    handleSampleContent 
  } = useDetectorInputActions({
    inputText,
    setInputText,
    setWordCount,
    setDetectionResult,
    toast,
    setError
  });

  // Analysis related actions
  const { handleAnalyze } = useDetectorAnalysisActions({
    inputText,
    setIsProcessing,
    setDetectionResult,
    history,
    setHistory,
    toast,
    setError
  });

  // Export related actions
  const { 
    handleCopy, 
    handleShareCopy,
    handleDownload, 
    handleExportCSV, 
    handleExportPDF, 
    copied 
  } = useDetectorExportActions({
    toast
  });

  // History related actions
  const { 
    handleHistoryItemClick, 
    handleClearHistory 
  } = useDetectorHistoryActions({
    setInputText,
    setDetectionResult,
    setWordCount,
    setHistory,
    setShowHistory,
    setError,
    toast
  });

  return {
    handleInputChange,
    updateWordCount,
    handleSampleText,
    handleSampleContent,
    handleAnalyze,
    handleCopy,
    handleShareCopy,
    handleDownload,
    handleExportCSV,
    handleExportPDF,
    handleHistoryItemClick,
    handleClearHistory,
    copied
  };
};
