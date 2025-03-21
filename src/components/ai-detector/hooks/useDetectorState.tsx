
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DetectionResult {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  analysis: string;
  patterns?: string[];
  suggestions?: string[];
}

export interface HistoryItem {
  id: string;
  text: string;
  result: DetectionResult;
  date: Date;
}

export const useDetectorState = () => {
  const [inputText, setInputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  
  // Check for input from AI Writer tool
  useEffect(() => {
    const detectorInput = localStorage.getItem('detector_input');
    if (detectorInput) {
      setInputText(detectorInput);
      
      // Calculate word count for the input
      const wordCountValue = detectorInput.trim().split(/\s+/).length;
      setWordCount(wordCountValue);
      
      // Clear the localStorage item
      localStorage.removeItem('detector_input');
      
      // Show notification
      toast({
        title: "Nội dung đã nhận",
        description: "Nội dung từ AI Writer đã được nhập vào AI Detector",
      });
    }
  }, []);

  return {
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
