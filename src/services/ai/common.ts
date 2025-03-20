
import { toast } from "@/components/ui/use-toast";

// API key is typically stored in environment variables, but for quick demo we're using it directly
export const API_KEY = "AIzaSyCAUUzlCkSxc8cTBWQdVGCvOxIQGSEnsIE";
export const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// Function to detect if text is Vietnamese
export const isVietnameseText = (text: string): boolean => {
  // Basic Vietnamese character patterns
  const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
  return vietnamesePattern.test(text);
};
