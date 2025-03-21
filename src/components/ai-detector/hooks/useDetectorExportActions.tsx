
import { useState } from 'react';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { exportAsCSV, exportAsPDF } from '../utils/exportUtils';

interface UseDetectorExportActionsProps {
  toast: any;
}

export const useDetectorExportActions = ({
  toast
}: UseDetectorExportActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Đã sao chép",
      description: "Kết quả phân tích đã được sao chép vào clipboard",
    });
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Đã sao chép",
      description: "Liên kết đã được sao chép vào clipboard",
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

  return {
    handleCopy,
    handleShareCopy,
    handleDownload,
    handleExportCSV,
    handleExportPDF,
    copied
  };
};
