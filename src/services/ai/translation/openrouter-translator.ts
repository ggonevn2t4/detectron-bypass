
import { callOpenRouterAPI, OpenRouterModel } from "../openrouter/openrouter-service";
import { TranslationOptions, TranslationResult } from "./translate-service";

/**
 * Dịch văn bản sử dụng OpenRouter API
 */
export const translateTextWithOpenRouter = async (
  text: string,
  options: TranslationOptions
): Promise<TranslationResult> => {
  try {
    const {
      sourceLanguage,
      targetLanguage,
      preserveFormatting = true,
      preserveTone = true,
      formalityLevel = 'standard'
    } = options;
    
    // Chọn mô hình dựa trên độ dài văn bản
    const model = text.length > 5000 
      ? OpenRouterModel.CLAUDE_3_SONNET 
      : text.length > 2000 
        ? OpenRouterModel.GPT4O 
        : OpenRouterModel.GPT4O_MINI;
    
    const prompt = `Translate the following text from ${sourceLanguage ? sourceLanguage : 'the automatically detected language'} to ${targetLanguage}.
    ${preserveFormatting ? 'Preserve the original formatting of the text.' : ''}
    ${preserveTone ? 'Maintain the original tone and style.' : ''}
    Formality level: ${formalityLevel === 'casual' ? 'casual/informal' : formalityLevel === 'formal' ? 'formal' : 'standard/neutral'}.
    
    Text to translate: "${text}"
    
    Only return the translated text, without any explanations.`;
    
    const systemPrompt = `You are an expert translator with deep knowledge of both ${sourceLanguage || 'various languages'} and ${targetLanguage}. Provide accurate translations that preserve the meaning, intent, and appropriate cultural context of the original text. Only return the translated text without explanations or other text.`;
    
    // Gọi OpenRouter API
    const translatedText = await callOpenRouterAPI(prompt, systemPrompt, {
      model,
      temperature: 0.3,
      max_tokens: text.length > 5000 ? 3000 : 2048
    });
    
    return {
      translatedText: translatedText.trim(),
      detectedSourceLanguage: sourceLanguage || "auto-detected",
      confidence: 0.9 // Giá trị mặc định
    };
  } catch (error) {
    console.error("Error translating text with OpenRouter:", error);
    throw error;
  }
};
