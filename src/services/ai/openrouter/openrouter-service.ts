
import { OPENROUTER_API_KEY, OPENROUTER_URL, OpenRouterResponse } from "../common";
import { toast } from "@/hooks/use-toast";
import requestCache from "../cache/request-cache";

// Các mô hình có sẵn trên OpenRouter
export enum OpenRouterModel {
  GPT4_TURBO = "gpt-4-turbo",
  GPT4O = "gpt-4o",
  GPT4O_MINI = "gpt-4o-mini",
  CLAUDE_3_OPUS = "claude-3-opus",
  CLAUDE_3_SONNET = "claude-3-sonnet",
  CLAUDE_3_HAIKU = "claude-3-haiku",
  GEMINI_PRO = "gemini-pro",
  GEMINI_ULTRA = "gemini-ultra",
  MISTRAL_LARGE = "mistral-large",
  LLAMA3_70B = "meta/llama-3-70b-instruct",
  LLAMA3_8B = "meta/llama-3-8b-instruct"
}

export interface OpenRouterOptions {
  model?: OpenRouterModel;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Gửi yêu cầu đến OpenRouter API với prompt đã cho
 */
export const callOpenRouterAPI = async (
  prompt: string,
  systemPrompt: string = "You are a helpful, accurate, and concise assistant.",
  options: OpenRouterOptions = {}
): Promise<string> => {
  try {
    // Kiểm tra dữ liệu đã lưu trong cache
    const cacheKey = `openrouter-${prompt.substring(0, 50)}-${systemPrompt.substring(0, 20)}-${JSON.stringify(options)}`;
    const cachedResult = requestCache.get<string>(cacheKey);
    
    if (cachedResult) {
      console.log("Using cached OpenRouter result");
      return cachedResult;
    }
    
    // Thiết lập mặc định
    const {
      model = OpenRouterModel.GPT4O_MINI,
      temperature = 0.7,
      max_tokens = 2048,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0
    } = options;
    
    const response = await fetch(`${OPENROUTER_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "HumanizeAI"
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature,
        max_tokens,
        top_p,
        frequency_penalty,
        presence_penalty
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      throw new Error(errorData.error?.message || "Error calling OpenRouter API");
    }
    
    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response generated from OpenRouter");
    }
    
    const result = data.choices[0].message.content.trim();
    
    if (!result) {
      throw new Error("Empty response from OpenRouter");
    }
    
    // Lưu kết quả vào cache
    requestCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection.");
    }
    
    throw error;
  }
};

/**
 * Chọn mô hình tự động dựa trên độ phức tạp của nhiệm vụ và độ dài văn bản
 */
export const chooseAppropriateModel = (
  text: string, 
  taskComplexity: 'low' | 'medium' | 'high' = 'medium'
): OpenRouterModel => {
  const textLength = text.length;
  
  // Nhiệm vụ đơn giản (phân tích văn bản ngắn, câu trả lời ngắn)
  if (taskComplexity === 'low') {
    if (textLength < 2000) return OpenRouterModel.GPT4O_MINI;
    return OpenRouterModel.CLAUDE_3_HAIKU;
  }
  
  // Nhiệm vụ trung bình (tóm tắt, dịch thuật)
  if (taskComplexity === 'medium') {
    if (textLength < 3000) return OpenRouterModel.GPT4O_MINI;
    if (textLength < 8000) return OpenRouterModel.GPT4O;
    return OpenRouterModel.CLAUDE_3_SONNET;
  }
  
  // Nhiệm vụ phức tạp (viết sáng tạo, phân tích chuyên sâu)
  if (textLength < 2000) return OpenRouterModel.GPT4O;
  if (textLength < 10000) return OpenRouterModel.CLAUDE_3_SONNET;
  return OpenRouterModel.CLAUDE_3_OPUS;
};
