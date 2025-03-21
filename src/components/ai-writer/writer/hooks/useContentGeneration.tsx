
import { useState } from 'react';
import { generateAIContent, AIGenerationOptions, AIGenerationResult } from '@/services/ai';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useUserLimits } from '@/hooks/useUserLimits';

interface ContentGenerationProps {
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
}

export const useContentGeneration = ({
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
}: ContentGenerationProps) => {
  const { user } = useAuth();
  const { canUseContentGeneration, incrementUsage } = useUserLimits();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Chủ đề trống",
        description: "Vui lòng nhập chủ đề để viết về",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra giới hạn sử dụng
    const limitCheck = canUseContentGeneration();
    
    if (!limitCheck.allowed) {
      toast({
        title: "Giới hạn sử dụng",
        description: limitCheck.message,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgressValue(0);
    
    // Simulate progress while content is being generated
    const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const options: AIGenerationOptions = {
        length,
        tone,
        format,
        audience,
        includeHeadings,
        includeFacts,
        includeQuotes,
        topic
      };
      
      const result = await generateAIContent(topic, options);
      setGeneratedResult(result);
      setProgressValue(100);
      
      // Cập nhật lượng sử dụng nếu người dùng đã đăng nhập
      if (user) {
        await incrementUsage({ contentGenerations: 1 });
      }
      
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

  const handleRegenerateContent = async () => {
    if (!topic.trim()) return;
    
    // Kiểm tra giới hạn sử dụng
    const limitCheck = canUseContentGeneration();
    
    if (!limitCheck.allowed) {
      toast({
        title: "Giới hạn sử dụng",
        description: limitCheck.message,
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setProgressValue(0);
    
    const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 300);
    
    try {
      const options: AIGenerationOptions = {
        length,
        tone,
        format,
        audience,
        includeHeadings,
        includeFacts,
        includeQuotes,
        topic
      };
      
      const result = await generateAIContent(topic, options);
      setGeneratedResult(result);
      setProgressValue(100);
      
      // Cập nhật lượng sử dụng nếu người dùng đã đăng nhập
      if (user) {
        await incrementUsage({ contentGenerations: 1 });
      }
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

  return {
    handleGenerate,
    handleRegenerateContent
  };
};
