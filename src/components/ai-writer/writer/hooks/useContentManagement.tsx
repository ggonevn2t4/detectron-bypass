import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWriterState } from '../useWriterState';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useContentManagement = ({
  topic,
  length,
  tone,
  format,
  audience,
  generatedResult
}: {
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual' | 'professional';
  format: 'article' | 'blog' | 'essay' | 'story' | 'summary';
  audience: 'general' | 'technical' | 'business' | 'academic';
  generatedResult: any;
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const supabaseClient = useSupabaseClient();

  // Handle copy action
  const handleCopy = () => {
    if (generatedResult && generatedResult.content) {
      navigator.clipboard.writeText(generatedResult.content)
        .then(() => {
          toast({
            title: "Đã sao chép",
            description: "Nội dung đã được sao chép vào clipboard"
          });
        })
        .catch(err => {
          toast({
            title: "Lỗi",
            description: "Không thể sao chép nội dung: " + err,
            variant: "destructive"
          });
        });
    } else {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để sao chép",
        variant: "destructive"
      });
    }
  };

  // Handle download action
  const handleDownload = () => {
    if (generatedResult && generatedResult.content) {
      const blob = new Blob([generatedResult.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-content.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Đã tải xuống",
        description: "Nội dung đã được tải xuống dưới dạng tệp văn bản"
      });
    } else {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để tải xuống",
        variant: "destructive"
      });
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (!generatedResult) return;
  
    const itemToSave = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      content: generatedResult.content,
      title: generatedResult.title || "Untitled Content",
      topic: generatedResult.options?.topic || topic,
      length: generatedResult.options?.length || length,
      tone: generatedResult.options?.tone || tone,
      format: generatedResult.options?.format || format,
      audience: generatedResult.options?.audience || audience,
      word_count: generatedResult.estimatedWordCount || generatedResult.wordCount,
      quality_score: generatedResult.qualityScore || 80
    };

    try {
      if (!user) {
        toast({
          title: "Chưa đăng nhập",
          description: "Bạn cần đăng nhập để lưu nội dung",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabaseClient
        .from('ai_writer_history')
        .insert([
          {
            ...itemToSave,
            user_id: user.id
          }
        ]);

      if (error) {
        console.error("Lỗi khi lưu nội dung:", error);
        toast({
          title: "Lỗi",
          description: "Không thể lưu nội dung: " + error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Đã lưu",
          description: "Nội dung đã được lưu thành công"
        });
      }
    } catch (err: any) {
      console.error("Lỗi không xác định khi lưu nội dung:", err);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu nội dung: " + err.message,
        variant: "destructive"
      });
    }
  };

  const handleSendToHumanizer = () => {
    if (generatedResult && generatedResult.content) {
      localStorage.setItem('humanizer_input', generatedResult.content);
      toast({
        title: "Đã chuyển nội dung",
        description: "Nội dung đã được chuyển sang AI Humanizer",
      });
    } else {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để chuyển",
        variant: "destructive"
      });
    }
  };

  const handleSendToDetector = () => {
    if (generatedResult && generatedResult.content) {
      localStorage.setItem('detector_input', generatedResult.content);
      toast({
        title: "Đã chuyển nội dung",
        description: "Nội dung đã được chuyển sang AI Detector",
      });
    } else {
      toast({
        title: "Không có nội dung",
        description: "Không có nội dung để chuyển",
        variant: "destructive"
      });
    }
  };

  return {
    handleCopy,
    handleDownload,
    handleSave,
    handleSendToHumanizer,
    handleSendToDetector
  };
};
