
import { toast } from "@/hooks/use-toast";
import { API_KEY, BASE_URL, DeepSeekResponse } from "../common";

export interface AIDetectionResult {
  score: number;
  analysis: string;
  confidence: "high" | "medium" | "low";
  patterns: string[];
  suggestions: string[];
}

export const detectAIContent = async (text: string): Promise<AIDetectionResult> => {
  try {
    // Check text length to avoid API limits
    if (text.length > 100000) {
      throw new Error("Văn bản quá dài. Vui lòng giảm kích thước văn bản.");
    }
    
    // Check if API key is available
    if (!API_KEY) {
      throw new Error("Thiếu API key. Không thể phân tích văn bản.");
    }

    const response = await fetch(
      `${BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `Analyze the following text to determine if it was written by AI or a human.
              
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
              
              Text to analyze: "${text}"`
            }
          ],
          temperature: 0.2,
          max_tokens: 1024
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error response:", errorData);
      throw new Error(errorData.error?.message || "Lỗi khi gọi API phân tích");
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Không nhận được phản hồi từ API");
    }

    const analysisText = data.choices[0].message.content;
    
    try {
      // Extract JSON from the response text
      const jsonStartIndex = analysisText.indexOf('{');
      const jsonEndIndex = analysisText.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error("Không thể phân tích định dạng JSON từ phản hồi");
      }
      
      const jsonString = analysisText.substring(jsonStartIndex, jsonEndIndex);
      
      const result = JSON.parse(jsonString) as AIDetectionResult;
      
      // Validate and ensure all fields exist
      return {
        score: Math.min(Math.max(result.score || 50, 0), 100),
        confidence: result.confidence || "medium",
        analysis: result.analysis || "Không thể cung cấp phân tích chi tiết.",
        patterns: result.patterns || ["Không phát hiện mẫu cụ thể."],
        suggestions: result.suggestions || ["Không có gợi ý cụ thể."]
      };
    } catch (e) {
      console.error("Error parsing AI detection response:", e);
      
      // Fallback to regex pattern matching if JSON parsing fails
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
    console.error("Error running AI detection:", error);
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
};
