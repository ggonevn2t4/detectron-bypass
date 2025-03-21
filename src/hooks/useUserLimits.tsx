
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface UserLimits {
  plan: string;
  planName: string;
  humanizationLimit: number | null;
  isHumanizationUnlimited: boolean;
  humanizationWordsUsed: number;
  contentGenerationLimit: number;
  contentGenerationsUsed: number;
  maxWordsPerProcess: number;
  detectionLevel: string;
  hasReachedHumanizationLimit: boolean;
  hasReachedContentGenerationLimit: boolean;
}

export const useUserLimits = () => {
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserLimits = async () => {
    if (!user) {
      setLimits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Gọi hàm check_user_limits
      const { data, error } = await supabase.rpc('check_user_limits', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      
      if (data && typeof data === 'object') {
        // Properly type and access the JSON data
        const jsonData = data as Record<string, Json>;
        
        // Convert to proper object type to handle JSON response from Supabase
        const limitsData: UserLimits = {
          plan: String(jsonData.plan || 'free'),
          planName: String(jsonData.plan_name || 'Free'),
          humanizationLimit: typeof jsonData.humanization_limit === 'number' ? jsonData.humanization_limit : null,
          isHumanizationUnlimited: Boolean(jsonData.is_humanization_unlimited),
          humanizationWordsUsed: Number(jsonData.humanization_words_used || 0),
          contentGenerationLimit: Number(jsonData.content_generation_limit || 0),
          contentGenerationsUsed: Number(jsonData.content_generations_used || 0),
          maxWordsPerProcess: Number(jsonData.max_words_per_process || 1000),
          detectionLevel: String(jsonData.detection_level || 'basic'),
          hasReachedHumanizationLimit: Boolean(jsonData.has_reached_humanization_limit),
          hasReachedContentGenerationLimit: Boolean(jsonData.has_reached_content_generation_limit)
        };
        
        setLimits(limitsData);
      } else {
        throw new Error("Invalid data format returned from check_user_limits");
      }
    } catch (error) {
      console.error('Error fetching user limits:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin giới hạn sử dụng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (options: {
    humanizationWords?: number;
    contentGenerations?: number;
  }) => {
    if (!user) return false;
    
    try {
      const { humanizationWords = 0, contentGenerations = 0 } = options;
      
      // Gọi hàm increment_user_usage
      const { data, error } = await supabase.rpc('increment_user_usage', {
        user_uuid: user.id,
        humanization_words: humanizationWords,
        content_generations: contentGenerations
      });
      
      if (error) throw error;
      
      // Cập nhật lại giới hạn sử dụng
      fetchUserLimits();
      
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  // Kiểm tra xem văn bản có vượt quá giới hạn xử lý không
  const checkTextSizeLimit = (text: string): boolean => {
    if (!limits) return true; // Nếu chưa có limits, tạm thời cho phép
    
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount <= limits.maxWordsPerProcess;
  };

  // Kiểm tra xem người dùng có thể sử dụng humanization không
  const canUseHumanization = (text: string): { allowed: boolean; message?: string } => {
    if (!limits) return { allowed: true }; // Nếu chưa có limits, tạm thời cho phép
    
    if (!checkTextSizeLimit(text)) {
      return { 
        allowed: false, 
        message: `Văn bản quá dài. Giới hạn của gói ${limits.planName} là ${limits.maxWordsPerProcess} từ mỗi lần xử lý.`
      };
    }
    
    if (limits.isHumanizationUnlimited) {
      return { allowed: true };
    }
    
    if (limits.hasReachedHumanizationLimit) {
      return { 
        allowed: false, 
        message: `Bạn đã sử dụng hết ${limits.humanizationLimit} từ trong tháng này. Nâng cấp lên gói Pro để có lượt xử lý không giới hạn.`
      };
    }
    
    const wordCount = text.trim().split(/\s+/).length;
    const remainingWords = limits.humanizationLimit ? limits.humanizationLimit - limits.humanizationWordsUsed : 0;
    
    if (wordCount > remainingWords) {
      return { 
        allowed: false, 
        message: `Văn bản của bạn có ${wordCount} từ, nhưng bạn chỉ còn lại ${remainingWords} từ trong tháng này. Nâng cấp lên gói Pro hoặc giảm độ dài văn bản.`
      };
    }
    
    return { allowed: true };
  };

  // Kiểm tra xem người dùng có thể sử dụng content generation không
  const canUseContentGeneration = (): { allowed: boolean; message?: string } => {
    if (!limits) return { allowed: true }; // Nếu chưa có limits, tạm thời cho phép
    
    if (limits.hasReachedContentGenerationLimit) {
      return { 
        allowed: false, 
        message: `Bạn đã sử dụng hết ${limits.contentGenerationLimit} lượt tạo nội dung trong tháng này. Nâng cấp lên gói Pro để có thêm lượt sử dụng.`
      };
    }
    
    return { allowed: true };
  };

  useEffect(() => {
    fetchUserLimits();
  }, [user]);

  return {
    limits,
    loading,
    fetchUserLimits,
    incrementUsage,
    checkTextSizeLimit,
    canUseHumanization,
    canUseContentGeneration
  };
};
