
import { useState } from 'react';
import { AIGenerationResult, AIGenerationOptions } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';

export const useWriterState = () => {
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
    
    // Toast
    toast
  };
};
