
import React, { useState } from 'react';
import { detectAIContent } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Container } from '@/components/ui/container';
import DetectorInput from './DetectorInput';
import DetectorOutput from './DetectorOutput';
import { sampleTexts } from '../humanizer/SampleTexts';
import { AIDetectionResult } from '@/services/ai/analysis/detailed-detector';

const DetectorTool = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<AIDetectionResult | null>(null);

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

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </Container>
    </section>
  );
};

export default DetectorTool;
