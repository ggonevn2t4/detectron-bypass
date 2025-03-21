
import { AIGenerationResult } from '@/services/ai';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface ContentManagementProps {
  topic: string;
  generatedResult: AIGenerationResult | null;
}

export const useContentManagement = ({
  topic,
  generatedResult
}: ContentManagementProps) => {
  const { user } = useAuth();

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
          length: generatedResult.options?.length,
          tone: generatedResult.options?.tone,
          format: generatedResult.options?.format,
          audience: generatedResult.options?.audience,
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

  return {
    handleCopy,
    handleDownload,
    handleSave
  };
};
