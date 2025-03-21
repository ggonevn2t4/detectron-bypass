
import { useState, useEffect } from 'react';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { useToast } from '@/hooks/use-toast';

// Interface for history item
export interface HistoryItem {
  id: string;
  timestamp: Date;
  inputText: string;
  result: AIDetectionResult | null;
}

export const useDetectorState = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<AIDetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('detectionHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing saved history:', e);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('detectionHistory', JSON.stringify(history));
  }, [history]);

  return {
    // State
    inputText,
    setInputText,
    wordCount,
    setWordCount,
    isProcessing,
    setIsProcessing,
    detectionResult,
    setDetectionResult,
    history,
    setHistory,
    showHistory,
    setShowHistory,
    toast
  };
};
