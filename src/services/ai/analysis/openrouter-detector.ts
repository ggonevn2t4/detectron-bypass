
import { callOpenRouterAPI, OpenRouterModel } from "../openrouter/openrouter-service";
import { AIDetectionResult } from "./detailed-detector";

/**
 * Sử dụng OpenRouter API để phát hiện nội dung AI
 */
export const detectAIContentWithOpenRouter = async (text: string): Promise<AIDetectionResult> => {
  try {
    // Chọn GPT-4o cho nhiệm vụ phát hiện AI (độ chính xác cao hơn)
    const model = OpenRouterModel.GPT4O;
    
    const prompt = `Analyze the following text to determine if it was written by AI or a human.
    
    Return your response in the following JSON format without any additional text:
    {
      "score": [numeric score from 0-100 where 100 means definitely AI-generated],
      "confidence": ["high", "medium", or "low"],
      "analysis": [2-3 sentence explanation of why you think the text is AI-generated or human-written],
      "patterns": [array of 3-5 specific patterns found that indicate AI or human writing],
      "suggestions": [array of 2-3 tips to make the text more human-like if it appears to be AI-generated]
    }
    
    Be extremely thorough in your analysis. Look for subtle patterns like:
    - Consistent sentence structures
    - Lack of personal anecdotes or genuine opinions
    - Excessive formality or perfectly balanced arguments
    - Unnaturally consistent tone throughout
    - Absence of contractions, slang, or idioms
    - Repetitive transition phrases
    
    Text to analyze: "${text}"`;
    
    const systemPrompt = `You are an expert at identifying AI-generated content. You can accurately distinguish between human-written and AI-generated text by analyzing patterns, language use, and structural elements. Provide your analysis in strict JSON format as requested.`;
    
    const analysisText = await callOpenRouterAPI(prompt, systemPrompt, {
      model,
      temperature: 0.2,
      max_tokens: 1024
    });
    
    try {
      // Trích xuất JSON từ phản hồi
      const jsonStartIndex = analysisText.indexOf('{');
      const jsonEndIndex = analysisText.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error("Không thể phân tích định dạng JSON từ phản hồi");
      }
      
      const jsonString = analysisText.substring(jsonStartIndex, jsonEndIndex);
      const result = JSON.parse(jsonString) as AIDetectionResult;
      
      // Xác thực và đảm bảo tất cả các trường tồn tại
      return {
        score: Math.min(Math.max(result.score || 50, 0), 100),
        confidence: result.confidence || "medium",
        analysis: result.analysis || "Không thể cung cấp phân tích chi tiết.",
        patterns: result.patterns || ["Không phát hiện mẫu cụ thể."],
        suggestions: result.suggestions || ["Không có gợi ý cụ thể."]
      };
    } catch (e) {
      console.error("Error parsing AI detection response:", e);
      
      // Fallback nếu phân tích JSON thất bại
      const scoreMatch = analysisText.match(/score"?\s*:?\s*(\d+)/i);
      const confidenceMatch = analysisText.match(/confidence"?\s*:?\s*"(high|medium|low)"/i);
      const analysisMatch = analysisText.match(/analysis"?\s*:?\s*"([^"]+)"/i);
      
      if (!scoreMatch) {
        throw new Error("Không thể trích xuất điểm số từ phân tích");
      }
      
      return {
        score: scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1], 10), 0), 100) : 50,
        confidence: (confidenceMatch ? confidenceMatch[1].toLowerCase() : "medium") as "high" | "medium" | "low",
        analysis: analysisMatch ? analysisMatch[1] : "Không thể cung cấp phân tích chi tiết.",
        patterns: ["Không phát hiện mẫu cụ thể."],
        suggestions: ["Không có gợi ý cụ thể."]
      };
    }
  } catch (error) {
    console.error("Error detecting AI content with OpenRouter:", error);
    throw error;
  }
};
