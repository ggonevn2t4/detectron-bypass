
import { API_KEY, BASE_URL, DeepSeekResponse } from "../common";
import { toast } from "@/hooks/use-toast";

export interface TextAnalysisResult {
  readability: {
    score: number; // 0-100, cao hơn = dễ đọc hơn
    grade: string; // Cấp độ đọc (ví dụ: "Tiểu học", "Trung học", "Đại học")
    averageSentenceLength: number;
    complexWords: number;
  };
  complexity: {
    score: number; // 0-100, cao hơn = phức tạp hơn
    vocabularyRichness: number; // Đa dạng từ vựng
    technicalTerms: number;
    advancedStructures: number;
  };
  consistency: {
    score: number; // 0-100, cao hơn = nhất quán hơn
    toneShifts: number;
    styleBreaks: number;
    themeCoherence: number;
  };
  summary: string;
  suggestions: string[];
}

/**
 * Phân tích chi tiết một đoạn văn bản
 */
export const analyzeText = async (text: string): Promise<TextAnalysisResult> => {
  try {
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
              content: `Phân tích chi tiết đoạn văn bản sau và trả về đánh giá về độ đọc, độ phức tạp, và tính nhất quán.
              
              Trả về phản hồi của bạn theo định dạng JSON dưới đây không có bất kỳ văn bản bổ sung nào:
              {
                "readability": {
                  "score": [số từ 0-100 với 100 là rất dễ đọc],
                  "grade": [cấp độ đọc, ví dụ: "Tiểu học", "Trung học", "Đại học"],
                  "averageSentenceLength": [độ dài câu trung bình theo số từ],
                  "complexWords": [số từ phức tạp]
                },
                "complexity": {
                  "score": [số từ 0-100 với 100 là rất phức tạp],
                  "vocabularyRichness": [số từ 0-100 đánh giá sự đa dạng từ vựng],
                  "technicalTerms": [số thuật ngữ kỹ thuật],
                  "advancedStructures": [số cấu trúc ngữ pháp nâng cao]
                },
                "consistency": {
                  "score": [số từ 0-100 với 100 là hoàn toàn nhất quán],
                  "toneShifts": [số lần chuyển đổi giọng điệu],
                  "styleBreaks": [số lần thay đổi phong cách],
                  "themeCoherence": [số từ 0-100 đánh giá sự gắn kết chủ đề]
                },
                "summary": [tóm tắt ngắn 1-2 câu về văn bản],
                "suggestions": [mảng 2-3 gợi ý để cải thiện văn bản]
              }
              
              Hãy đánh giá kỹ lưỡng, xem xét:
              - Cấu trúc câu và đoạn văn
              - Độ phức tạp của từ vựng
              - Sự nhất quán về giọng điệu và phong cách
              - Tính mạch lạc của chủ đề
              - Sự rõ ràng và dễ hiểu
              
              Văn bản cần phân tích: "${text}"`
            }
          ],
          temperature: 0.2,
          max_tokens: 1024
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Lỗi khi phân tích văn bản");
    }

    const data: DeepSeekResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      const analysisText = data.choices[0].message.content;
      
      try {
        // Trích xuất JSON từ phản hồi
        const jsonStartIndex = analysisText.indexOf('{');
        const jsonEndIndex = analysisText.lastIndexOf('}') + 1;
        const jsonString = analysisText.substring(jsonStartIndex, jsonEndIndex);
        
        const result = JSON.parse(jsonString) as TextAnalysisResult;
        
        // Xác thực và đảm bảo tất cả các trường tồn tại
        return {
          readability: {
            score: Math.min(Math.max(result.readability?.score || 50, 0), 100),
            grade: result.readability?.grade || "Trung học",
            averageSentenceLength: result.readability?.averageSentenceLength || 15,
            complexWords: result.readability?.complexWords || 0
          },
          complexity: {
            score: Math.min(Math.max(result.complexity?.score || 50, 0), 100),
            vocabularyRichness: Math.min(Math.max(result.complexity?.vocabularyRichness || 50, 0), 100),
            technicalTerms: result.complexity?.technicalTerms || 0,
            advancedStructures: result.complexity?.advancedStructures || 0
          },
          consistency: {
            score: Math.min(Math.max(result.consistency?.score || 50, 0), 100),
            toneShifts: result.consistency?.toneShifts || 0,
            styleBreaks: result.consistency?.styleBreaks || 0,
            themeCoherence: Math.min(Math.max(result.consistency?.themeCoherence || 50, 0), 100)
          },
          summary: result.summary || "Không thể tạo tóm tắt.",
          suggestions: result.suggestions || ["Không có gợi ý nào được cung cấp."]
        };
      } catch (e) {
        console.error("Lỗi phân tích kết quả phân tích văn bản:", e);
        
        // Fallback khi xử lý JSON thất bại
        return {
          readability: {
            score: 50,
            grade: "Trung học",
            averageSentenceLength: 15,
            complexWords: 0
          },
          complexity: {
            score: 50,
            vocabularyRichness: 50,
            technicalTerms: 0,
            advancedStructures: 0
          },
          consistency: {
            score: 50,
            toneShifts: 0,
            styleBreaks: 0,
            themeCoherence: 50
          },
          summary: "Không thể tạo tóm tắt do lỗi phân tích.",
          suggestions: ["Không thể cung cấp gợi ý do lỗi phân tích."]
        };
      }
    }

    throw new Error("Không thể phân tích văn bản");
  } catch (error) {
    console.error("Lỗi khi chạy phân tích văn bản:", error);
    toast({
      title: "Lỗi",
      description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
      variant: "destructive",
    });
    
    // Giá trị mặc định khi lỗi
    return {
      readability: {
        score: 50,
        grade: "Không thể xác định",
        averageSentenceLength: 0,
        complexWords: 0
      },
      complexity: {
        score: 50,
        vocabularyRichness: 50,
        technicalTerms: 0,
        advancedStructures: 0
      },
      consistency: {
        score: 50,
        toneShifts: 0,
        styleBreaks: 0,
        themeCoherence: 50
      },
      summary: "Không thể phân tích văn bản. Vui lòng thử lại sau.",
      suggestions: ["Thử lại sau hoặc sử dụng một đoạn văn bản khác."]
    };
  }
};

/**
 * Phân tích và trả về điểm AI của một đoạn văn bản
 */
export const analyzeAIScore = async (text: string): Promise<number> => {
  try {
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
              content: `Analyze this text and estimate what percentage (0-100) was likely written by AI: "${text.substring(0, 2000)}..."`
            }
          ],
          temperature: 0.2,
          max_tokens: 100
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing AI score");
    }

    const data: DeepSeekResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const resultText = data.choices[0].message.content;
      // Extract percentage from result
      const percentMatch = resultText.match(/(\d+)%/);
      if (percentMatch && percentMatch[1]) {
        return Math.min(Math.max(parseInt(percentMatch[1], 10), 0), 100);
      }
      
      // Fallback: extract any number from 0-100
      const numberMatch = resultText.match(/\b([0-9]{1,2}|100)\b/);
      if (numberMatch && numberMatch[1]) {
        return Math.min(Math.max(parseInt(numberMatch[1], 10), 0), 100);
      }
    }
    
    // Default value if no percentage found
    return 50;
  } catch (error) {
    console.error("Error analyzing AI score:", error);
    return 50; // Default fallback value
  }
};
