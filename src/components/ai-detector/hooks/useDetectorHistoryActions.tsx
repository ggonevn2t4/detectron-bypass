
import { HistoryItem } from './useDetectorState';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';

interface UseDetectorHistoryActionsProps {
  setInputText: (text: string) => void;
  setDetectionResult: (result: AIDetectionResult | null) => void;
  setWordCount: (count: number) => void;
  setHistory: (history: HistoryItem[]) => void;
  setShowHistory: (show: boolean) => void;
  setError?: (error: string | null) => void;
  toast: any;
}

export const useDetectorHistoryActions = ({
  setInputText,
  setDetectionResult,
  setWordCount,
  setHistory,
  setShowHistory,
  setError,
  toast
}: UseDetectorHistoryActionsProps) => {
  const handleHistoryItemClick = (item: HistoryItem, isMobile: boolean) => {
    setInputText(item.text);
    // The result is already AIDetectionResult compatible because we updated the interface
    setDetectionResult(item.result);
    updateWordCount(item.text);
    setError && setError(null);
    
    if (isMobile) {
      setShowHistory(false);
    }
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Đã xóa lịch sử",
      description: "Lịch sử phân tích đã được xóa hoàn toàn",
    });
  };

  return {
    handleHistoryItemClick,
    handleClearHistory
  };
};
