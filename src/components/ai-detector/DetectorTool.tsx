
import React, { useState, useEffect } from 'react';
import { detectAIContent } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Container } from '@/components/ui/container';
import DetectorInput from './DetectorInput';
import DetectorOutput from './DetectorOutput';
import { sampleTexts } from '../humanizer/SampleTexts';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Clock, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Định nghĩa interface cho item lịch sử
interface HistoryItem {
  id: string;
  timestamp: Date;
  inputText: string;
  result: AIDetectionResult | null;
}

const DetectorTool = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [inputText, setInputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<AIDetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Lấy lịch sử từ localStorage khi component được mount
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

  // Lưu lịch sử vào localStorage khi history thay đổi
  useEffect(() => {
    localStorage.setItem('detectionHistory', JSON.stringify(history));
  }, [history]);

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

  const handleSampleText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
    updateWordCount(sampleTexts[randomIndex]);
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
      
      // Lưu kết quả vào lịch sử
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        inputText: inputText,
        result: result
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20)); // Giới hạn lịch sử đến 20 mục
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

  const handleHistoryItemClick = (item: HistoryItem) => {
    setInputText(item.inputText);
    setDetectionResult(item.result);
    updateWordCount(item.inputText);
    
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

  const formatTimestamp = (timestamp: Date) => {
    // Chuyển string date thành Date object nếu cần
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-10 px-4 sm:px-6 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History Sidebar - Hiển thị bên trái trên desktop, có thể thu gọn trên mobile */}
          {(showHistory || !isMobile) && (
            <Card className={`${isMobile ? 'fixed inset-0 z-50 overflow-auto' : 'h-full'} bg-card shadow-sm border border-border`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                <CardTitle className="text-xl font-medium flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  Lịch sử phân tích
                </CardTitle>
                <div className="flex space-x-2">
                  {isMobile && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowHistory(false)}
                    >
                      Đóng
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearHistory}
                    disabled={history.length === 0}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Xóa lịch sử
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có lịch sử phân tích nào
                  </p>
                ) : (
                  <ScrollArea className="h-[calc(100vh-240px)]">
                    <div className="space-y-3 pr-3">
                      {history.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleHistoryItemClick(item)}
                          className="p-3 rounded-md border border-border/60 hover:bg-muted cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center">
                              <span 
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  item.result && item.result.score >= 90 
                                    ? 'bg-red-500' 
                                    : item.result && item.result.score >= 70 
                                    ? 'bg-amber-500' 
                                    : 'bg-green-500'
                                }`}
                              />
                              <span className="font-medium">
                                {item.result ? `${item.result.score}% AI` : 'Chưa phân tích'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(item.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2 text-muted-foreground">
                            {item.inputText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Content - Chiếm 2 cột trên desktop */}
          <div className={`${isMobile || !history.length ? 'col-span-1 lg:col-span-3' : 'col-span-1 lg:col-span-2'}`}>
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
              {isMobile && history.length > 0 && !showHistory && (
                <div className="p-3 bg-muted/30 border-b border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => setShowHistory(true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Xem lịch sử phân tích ({history.length})
                  </Button>
                </div>
              )}

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <DetectorInput
                    inputText={inputText}
                    wordCount={wordCount}
                    isProcessing={isProcessing}
                    onInputChange={handleInputChange}
                    onSampleText={handleSampleText}
                    onAnalyze={handleAnalyze}
                  />
                  <DetectorOutput
                    score={detectionResult?.score ?? null}
                    analysis={detectionResult?.analysis ?? ''}
                    confidence={detectionResult?.confidence ?? 'medium'}
                    patterns={detectionResult?.patterns}
                    suggestions={detectionResult?.suggestions}
                    isProcessing={isProcessing}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DetectorTool;
