
import { AIGenerationResult } from '@/services/ai';
import { useContentGeneration } from './hooks/useContentGeneration';
import { useContentManagement } from './hooks/useContentManagement';
import { useNavigationActions } from './hooks/useNavigationActions';

interface WriterActionsProps {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual' | 'professional';
  format: 'article' | 'blog' | 'essay' | 'story' | 'summary';
  audience: 'general' | 'technical' | 'business' | 'academic';
  includeHeadings: boolean;
  includeFacts: boolean;
  includeQuotes: boolean;
  setGeneratedResult: (result: AIGenerationResult | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setProgressValue: React.Dispatch<React.SetStateAction<number>>;
  generatedResult: AIGenerationResult | null;
}

export const useWriterActions = (props: WriterActionsProps) => {
  const {
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
    generatedResult
  } = props;

  // Content generation actions
  const { 
    handleGenerate, 
    handleRegenerateContent 
  } = useContentGeneration({
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
    setProgressValue
  });

  // Content management actions
  const { 
    handleCopy, 
    handleDownload, 
    handleSave 
  } = useContentManagement({
    topic,
    generatedResult
  });

  // Navigation actions
  const { 
    handleSendToHumanizer, 
    handleSendToDetector 
  } = useNavigationActions({
    generatedResult
  });

  return {
    handleGenerate,
    handleRegenerateContent,
    handleCopy,
    handleDownload,
    handleSave,
    handleSendToHumanizer,
    handleSendToDetector
  };
};
