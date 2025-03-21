
import { useState } from 'react';
import { detectAIContent, AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { HistoryItem, DetectionResult } from './useDetectorState';
import { SampleContent } from '../SampleContents';
import { exportAsCSV, exportAsPDF } from '../utils/exportUtils';

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

export const useDetectorActions = ({
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
}: UseDetectorActionsProps) => {
  const [copied, setCopied] = useState(false);

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

  const handleExportCSV = (result: AIDetectionResult) => {
    if (!result) return;
    
    try {
      exportAsCSV(result);
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Kết quả phân tích đã được tải xuống dưới dạng CSV",
      });
    } catch (error) {
      console.error('Error exporting as CSV:', error);
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu dưới dạng CSV",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = (result: AIDetectionResult) => {
    if (!result) return;
    
    try {
      exportAsPDF(result);
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Kết quả phân tích đã được tải xuống dưới dạng PDF",
      });
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      toast({
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu dưới dạng PDF",
        variant: "destructive",
      });
    }
  };

  const handleHistoryItemClick = (item: HistoryItem, isMobile: boolean) => {
    setInputText(item.text);
    setDetectionResult(item.result as AIDetectionResult);
    updateWordCount(item.text);
    setError && setError(null);
    
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
    handleSampleContent,
    handleAnalyze,
    handleCopy,
    handleDownload,
    handleExportCSV,
    handleExportPDF,
    handleHistoryItemClick,
    handleClearHistory,
    copied
  };
};
