
import { useState } from 'react';
import { detectAIContent, AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { HistoryItem } from './useDetectorState';

interface UseDetectorAnalysisActionsProps {
  inputText: string;
  setIsProcessing: (isProcessing: boolean) => void;
  setDetectionResult: (result: AIDetectionResult | null) => void;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  toast: any;
  setError?: (error: string | null) => void;
}

export const useDetectorAnalysisActions = ({
  inputText,
  setIsProcessing,
  setDetectionResult,
  history,
  setHistory,
  toast,
  setError
}: UseDetectorAnalysisActionsProps) => {
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Văn bản trống",
        description: "Vui lòng nhập văn bản để phân tích",
        variant: "destructive",
      });
      return;
    }

    // Clear previous error
    setError && setError(null);
    setIsProcessing(true);
    
    try {
      const result = await detectAIContent(inputText);
      setDetectionResult(result);
      
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
      
      setHistory([newHistoryItem, ...history].slice(0, 20));
    } catch (error) {
      console.error('Error analyzing text:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Đã xảy ra lỗi khi phân tích văn bản";
      
      setError && setError(errorMessage);
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleAnalyze
  };
};
