
import { toast } from "@/components/ui/use-toast";

// API key for DeepSeek
export const API_KEY = "sk-cd308e06aeef4cb999efa5c3d59b0376";
export const BASE_URL = "https://api.deepseek.com/v1";

// API key for OpenRouter
export const OPENROUTER_API_KEY = "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";
export const OPENROUTER_URL = "https://openrouter.ai/api/v1";

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

// OpenRouter response interface
export interface OpenRouterResponse {
  id: string;
  model: string;
  created: number;
  object: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Function to detect if text is Vietnamese
export const isVietnameseText = (text: string): boolean => {
  // Basic Vietnamese character patterns
  const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
  return vietnamesePattern.test(text);
};
