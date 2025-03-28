
import { API_KEY, BASE_URL, DEEPSEEK_MODEL, DeepSeekResponse } from "../common";
import { toast } from "@/hooks/use-toast";

export interface TranslationOptions {
  sourceLanguage?: string; // Ngôn ngữ nguồn (tự động phát hiện nếu không chỉ định)
  targetLanguage: string; // Ngôn ngữ đích
  preserveFormatting?: boolean; // Giữ định dạng
  preserveTone?: boolean; // Giữ giọng điệu
  formalityLevel?: 'casual' | 'standard' | 'formal'; // Mức độ trang trọng
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  confidence: number; // 0-1
}

/**
 * Dịch văn bản sang ngôn ngữ khác
 */
export const translateText = async (
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

    const prompt = `Dịch văn bản sau từ ${sourceLanguage ? sourceLanguage : 'ngôn ngữ được phát hiện tự động'} sang ${targetLanguage}.
    ${preserveFormatting ? 'Giữ nguyên định dạng văn bản.' : ''}
    ${preserveTone ? 'Duy trì giọng điệu và phong cách gốc.' : ''}
    Mức độ trang trọng: ${formalityLevel === 'casual' ? 'thân mật' : formalityLevel === 'formal' ? 'trang trọng' : 'tiêu chuẩn'}.
    
    Văn bản cần dịch: "${text}"
    
    Chỉ trả về văn bản đã dịch, không có bất kỳ giải thích nào khác.`;

    const response = await fetch(
      `${BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2048
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Lỗi khi dịch văn bản");
    }

    const data: DeepSeekResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      const translatedText = data.choices[0].message.content;
      
      // Tạo kết quả
      return {
        translatedText: translatedText.trim(),
        detectedSourceLanguage: sourceLanguage || "auto-detected",
        confidence: 0.85 // Gán giá trị mặc định vì DeepSeek không cung cấp độ tin cậy
      };
    }

    throw new Error("Không thể dịch văn bản");
  } catch (error) {
    console.error("Lỗi khi dịch văn bản:", error);
    toast({
      title: "Lỗi",
      description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi dịch văn bản",
      variant: "destructive",
    });
    
    // Giá trị mặc định khi lỗi
    return {
      translatedText: text,
      confidence: 0
    };
  }
};
