
import { generateAIContent, AIGenerationOptions, AIGenerationResult } from '@/services/ai';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUserLimits } from '@/hooks/useUserLimits';

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

export const useWriterActions = ({
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
  generatedResult,
}: WriterActionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleSave = async () => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu nội dung",
        variant: "destructive",
      });
      return;
    }

    // Check if we have generated content
    if (!generatedResult) {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để lưu",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert content into Supabase
      const { error } = await supabase
        .from('content_history')
        .insert({
          user_id: user.id,
          title: generatedResult.title,
          content: generatedResult.content,
          topic: topic,
          length: length,
          tone: tone,
          format: format,
          audience: audience,
          word_count: generatedResult.estimatedWordCount,
          quality_score: generatedResult.qualityScore
        });

      if (error) throw error;

      toast({
        title: "Đã lưu nội dung",
        description: "Nội dung đã được lưu vào tài khoản của bạn",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Lỗi khi lưu",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi lưu nội dung",
        variant: "destructive",
      });
    }
  };

  const handleSendToHumanizer = () => {
    if (!generatedResult) {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để gửi đến Humanizer",
        variant: "destructive",
      });
      return;
    }

    // Store content in localStorage to pass between tools
    localStorage.setItem('humanizer_input', generatedResult.content);
    
    // Navigate to the humanizer tool
    navigate('/');
    
    // Show notification
    toast({
      title: "Đã chuyển sang Humanizer",
      description: "Nội dung đã được chuyển đến công cụ Humanizer",
    });
    
    // Select the humanizer tab
    setTimeout(() => {
      const humanizerTab = document.querySelector('[data-value="humanizer"]') as HTMLElement;
      if (humanizerTab) {
        humanizerTab.click();
      }
    }, 100);
  };

  const handleSendToDetector = () => {
    if (!generatedResult) {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để kiểm tra",
        variant: "destructive",
      });
      return;
    }

    // Store content in localStorage to pass between tools
    localStorage.setItem('detector_input', generatedResult.content);
    
    // Navigate to the detector tool
    navigate('/');
    
    // Show notification
    toast({
      title: "Đã chuyển sang AI Detector",
      description: "Nội dung đã được chuyển đến công cụ AI Detector",
    });
    
    // Select the detector tab
    setTimeout(() => {
      const detectorTab = document.querySelector('[data-value="detector"]') as HTMLElement;
      if (detectorTab) {
        detectorTab.click();
      }
    }, 100);
  };

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
