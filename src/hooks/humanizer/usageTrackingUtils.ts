
import { useUserLimits } from '@/hooks/useUserLimits';
import { toast } from '@/hooks/use-toast';

/**
 * Check if user is allowed to use humanization based on limits
 */
export const checkUsageLimits = (
  text: string,
  canUseHumanization: (text: string) => { allowed: boolean; message?: string }
): { allowed: boolean; message?: string } => {
  const limitCheck = canUseHumanization(text);
  
  if (!limitCheck.allowed && limitCheck.message) {
    toast({
      title: "Giới hạn sử dụng",
      description: limitCheck.message,
      variant: "destructive",
    });
  }
  
  return limitCheck;
};

/**
 * Track usage for authenticated users
 */
export const trackUsage = async (
  user: any, 
  wordCount: number,
  incrementUsage: (data: { humanizationWords: number }) => Promise<any>
): Promise<void> => {
  if (user) {
    await incrementUsage({ humanizationWords: wordCount });
  }
};
