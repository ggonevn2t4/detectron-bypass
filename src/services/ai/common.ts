
import { toast } from "@/components/ui/use-toast";

// API key for DeepSeek
export const API_KEY = "sk-cd308e06aeef4cb999efa5c3d59b0376";
export const BASE_URL = "https://api.deepseek.com/v1";

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

// Function to detect if text is Vietnamese
export const isVietnameseText = (text: string): boolean => {
  // Basic Vietnamese character patterns
  const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
  return vietnamesePattern.test(text);
};
