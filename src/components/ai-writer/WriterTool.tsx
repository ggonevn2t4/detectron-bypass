
import React, { useState } from 'react';
import { 
  generateAIContent, 
  AIGenerationOptions, 
  AIGenerationResult 
} from '@/services/ai';
import { useToast } from '@/hooks/use-toast';
import { Container } from '@/components/ui/container';
import WriterInput from './WriterInput';
import WriterOutput from './WriterOutput';
import { Progress } from '@/components/ui/progress';

const WriterTool = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [tone, setTone] = useState<'formal' | 'casual' | 'professional'>('professional');
  const [format, setFormat] = useState<'article' | 'blog' | 'essay' | 'story' | 'summary'>('article');
  const [audience, setAudience] = useState<'general' | 'technical' | 'business' | 'academic'>('general');
  const [includeHeadings, setIncludeHeadings] = useState(true);
  const [includeFacts, setIncludeFacts] = useState(true);
  const [includeQuotes, setIncludeQuotes] = useState(false);
  
  const [generatedResult, setGeneratedResult] = useState<AIGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Chủ đề trống",
        description: "Vui lòng nhập chủ đề để viết về",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgressValue(0);
    
    // Simulate progress while content is being generated
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const options: AIGenerationOptions = {
        topic,
        length,
        tone,
        format,
        audience,
        includeHeadings,
        includeFacts,
        includeQuotes
      };
      
      const result = await generateAIContent(options);
      setGeneratedResult(result);
      setProgressValue(100);
      
      toast({
        title: "Đã tạo nội dung",
        description: "Nội dung của bạn đã được tạo thành công",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo nội dung",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
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
      description: `Nội dung đã được tải xuống dưới dạng ${filename}`,
    });
  };

  const handleRegenerateContent = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setProgressValue(0);
    
    const progressInterval = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const options: AIGenerationOptions = {
        topic,
        length,
        tone,
        format,
        audience,
        includeHeadings,
        includeFacts,
        includeQuotes
      };
      
      const result = await generateAIContent(options);
      setGeneratedResult(result);
      setProgressValue(100);
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo lại nội dung",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Đã lưu nội dung",
      description: "Nội dung đã được lưu vào tài khoản của bạn",
    });
  };

  return (
    <section className="py-10 px-6 bg-background">
      <Container>
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WriterInput
                topic={topic}
                setTopic={setTopic}
                length={length}
                setLength={setLength}
                tone={tone}
                setTone={setTone}
                format={format}
                setFormat={setFormat}
                audience={audience}
                setAudience={setAudience}
                includeHeadings={includeHeadings}
                setIncludeHeadings={setIncludeHeadings}
                includeFacts={includeFacts}
                setIncludeFacts={setIncludeFacts}
                includeQuotes={includeQuotes}
                setIncludeQuotes={setIncludeQuotes}
                isGenerating={isGenerating}
                onGenerate={handleGenerate}
              />
              
              {isGenerating && (
                <div className="md:col-span-2 mb-3">
                  <Progress value={progressValue} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {progressValue < 30 
                      ? 'Đang phân tích chủ đề và nghiên cứu...' 
                      : progressValue < 60
                      ? 'Đang tạo nội dung với tùy chọn của bạn...'
                      : progressValue < 95
                      ? 'Đang hoàn thiện và làm mịn nội dung...'
                      : 'Hoàn thành!'}
                  </p>
                </div>
              )}
              
              <WriterOutput
                content={generatedResult?.content || ''}
                title={generatedResult?.title}
                estimatedWordCount={generatedResult?.estimatedWordCount}
                isGenerating={isGenerating}
                onCopy={handleCopy}
                onDownload={handleDownload}
                contentScore={generatedResult?.qualityScore}
                onRegenerate={handleRegenerateContent}
                onSave={handleSave}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WriterTool;
