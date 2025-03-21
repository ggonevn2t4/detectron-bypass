
import { useState } from 'react';
import { detectAIContent, AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { HistoryItem, DetectionResult } from './useDetectorState';

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
}

export const useDetectorActions = ({
  inputText,
  setInputText,
  setWordCount,
  setIsProcessing,
  setDetectionResult,
  history,
  setHistory,
  setShowHistory,
  toast
}: UseDetectorActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateWordCount(text);
    // Reset results when input changes
    setDetectionResult(null);
  };

  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  const handleSampleText = (sampleText: string) => {
    setInputText(sampleText);
    updateWordCount(sampleText);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Văn bản trống",
        description: "Vui lòng nhập văn bản để phân tích",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await detectAIContent(inputText);
      setDetectionResult(result);
      
      // Save result to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        text: inputText,
        inputText: inputText,
        result: {
          score: result.score,
          confidence: result.confidence,
          analysis: result.analysis,
          patterns: result.patterns,
          suggestions: result.suggestions
        },
        date: new Date(),
        timestamp: new Date()
      };
      
      setHistory([newHistoryItem, ...history].slice(0, 20)); // Limit history to 20 items
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi phân tích văn bản",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Đã sao chép",
      description: "Kết quả phân tích đã được sao chép vào clipboard",
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Đã tải xuống",
      description: `Kết quả phân tích đã được tải xuống dưới dạng ${filename}`,
    });
  };

  const handleHistoryItemClick = (item: HistoryItem, isMobile: boolean) => {
    setInputText(item.text);
    setDetectionResult(item.result as AIDetectionResult);
    updateWordCount(item.text);
    
    if (isMobile) {
      setShowHistory(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "Đã xóa lịch sử",
      description: "Lịch sử phân tích đã được xóa hoàn toàn",
    });
  };

  return {
    handleInputChange,
    updateWordCount,
    handleSampleText,
    handleAnalyze,
    handleCopy,
    handleDownload,
    handleHistoryItemClick,
    handleClearHistory,
    copied
  };
};
