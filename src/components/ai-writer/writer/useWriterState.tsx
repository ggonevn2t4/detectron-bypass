
import { useState } from 'react';
import { AIGenerationResult } from '@/services/ai';
import { toast } from '@/hooks/use-toast';
import { useWriterActions } from './useWriterActions';

export const useWriterState = () => {
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

  const actions = useWriterActions({
    topic,
    length,
    tone,
    format,
    audience,
    includeHeadings,
    includeFacts,
    includeQuotes,
    setGeneratedResult,
    setIsGenerating,
    setProgressValue,
    generatedResult  // Add this line to pass the generatedResult parameter
  });

  // Handle content editing
  const handleContentEdit = (newContent: string) => {
    if (generatedResult) {
      const updatedResult = {
        ...generatedResult,
        content: newContent,
        // Recalculate word count
        estimatedWordCount: newContent.trim().split(/\s+/).length
      };
      setGeneratedResult(updatedResult);
      toast({
        title: "Nội dung đã cập nhật",
        description: "Bạn đã chỉnh sửa nội dung thành công"
      });
    }
  };

  // Handle title editing
  const handleTitleEdit = (newTitle: string) => {
    if (generatedResult) {
      const updatedResult = {
        ...generatedResult,
        title: newTitle
      };
      setGeneratedResult(updatedResult);
    }
  };

  return {
    // Form fields
    topic, setTopic,
    length, setLength,
    tone, setTone,
    format, setFormat,
    audience, setAudience,
    includeHeadings, setIncludeHeadings,
    includeFacts, setIncludeFacts,
    includeQuotes, setIncludeQuotes,
    
    // Generation state
    generatedResult, setGeneratedResult,
    isGenerating, setIsGenerating,
    progressValue, setProgressValue,
    
    // Content editing
    handleContentEdit,
    handleTitleEdit,
    
    // Actions
    ...actions
  };
};
