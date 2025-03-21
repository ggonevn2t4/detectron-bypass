
import { chooseAppropriateModel, callOpenRouterAPI, OpenRouterModel } from "../openrouter/openrouter-service";
import { buildHumanizationPrompt } from "./prompt-builder";
import { HumanizationOptions } from "./gemini-humanizer";

/**
 * Sử dụng OpenRouter API để làm cho văn bản giống con người hơn
 */
export const humanizeTextWithOpenRouter = async (
  text: string,
  previousScore?: number,
  options?: HumanizationOptions
): Promise<string> => {
  try {
    // Thiết lập mặc định
    const {
      approach = 'standard',
      style = 'general'
    } = options || {};
    
    // Xây dựng prompt dựa trên tùy chọn của người dùng
    const promptText = buildHumanizationPrompt(text, {
      ...options,
      previousScore
    });
    
    // Cường độ nhiệm vụ dựa trên approach
    const taskComplexity: 'low' | 'medium' | 'high' = 
      approach === 'ultra' ? 'high' : 
      approach === 'aggressive' ? 'medium' : 'low';
    
    // Chọn mô hình phù hợp dựa trên độ phức tạp của văn bản
    let model: OpenRouterModel;
    
    if (options?.model) {
      // Sử dụng mô hình người dùng chỉ định nếu có
      model = options.model as OpenRouterModel;
    } else {
      // Tự động chọn mô hình phù hợp
      model = chooseAppropriateModel(text, taskComplexity);
    }
    
    // Thiết lập nhiệt độ dựa trên approach
    const temperature = approach === 'ultra' ? 0.9 : approach === 'aggressive' ? 0.7 : 0.5;
    
    // Hệ thống prompt cho humanizing
    const systemPrompt = `You are an expert at making AI-generated text sound more natural and human-like. 
Your task is to rewrite the provided text to make it indistinguishable from human writing.
Maintain the original meaning but make it more natural, with varied sentence structures and a conversational tone.
${style === 'academic' ? 'Use academic language and formal structure.' : ''}
${style === 'creative' ? 'Use creative and expressive language.' : ''}
${style === 'professional' ? 'Use professional and business-appropriate language.' : ''}`;
    
    // Gọi OpenRouter API
    const result = await callOpenRouterAPI(promptText, systemPrompt, {
      model,
      temperature,
      max_tokens: 2048
    });
    
    return result;
  } catch (error) {
    console.error("Error humanizing text with OpenRouter:", error);
    throw error;
  }
};
