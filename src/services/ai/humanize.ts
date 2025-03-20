
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse, isVietnameseText } from "./common";
import { englishHumanizationPrompt, vietnameseHumanizationPrompt } from "./prompts";
import { calculateInitialAiScore } from "./detect";

interface HumanizationOptions {
  targetScore?: number;
  approach?: 'standard' | 'aggressive' | 'ultra';
  style?: string;
  iterationCount?: number;
}

// Advanced humanization prompt engineering for better results
export const humanizeTextWithGemini = async (
  text: string, 
  previousScore?: number, 
  options?: HumanizationOptions
): Promise<string> => {
  try {
    // Set defaults for options
    const {
      targetScore = 95,
      approach = 'standard',
      style = 'general',
      iterationCount = 1
    } = options || {};
    
    // Determine language and select appropriate prompt
    const isVietnamese = isVietnameseText(text);
    const basePrompt = isVietnamese ? vietnameseHumanizationPrompt : englishHumanizationPrompt;
    
    // Build a more detailed prompt based on settings
    let promptText = basePrompt;
    
    // Add approach-specific instructions
    if (approach === 'aggressive') {
      promptText += isVietnamese ? 
        "\nSử dụng cách tiếp cận tích cực hơn để nhân hóa văn bản. Thay đổi cấu trúc câu đáng kể và thay thế nhiều từ vựng, đồng thời vẫn giữ nguyên ý nghĩa. Thêm nhiều điểm ngắt tự nhiên, lỗi ngữ pháp nhỏ và cách diễn đạt không chính thức." :
        "\nUse a more aggressive approach to humanizing the text. Change sentence structures significantly and replace more vocabulary while maintaining the meaning. Add more natural breaks, minor grammatical errors, and informal expressions.";
    } else if (approach === 'ultra') {
      promptText += isVietnamese ?
        "\nSử dụng cách tiếp cận cực kỳ mạnh mẽ để nhân hóa. Viết lại hoàn toàn văn bản theo cách mà một người sẽ viết một cách tự nhiên, với ít cấu trúc chính thức hơn, nhiều ý kiến cá nhân, và thêm một số lỗi đánh máy hoặc ngữ pháp nhỏ như người viết thông thường. Nếu cần, có thể thay đổi cách trình bày chi tiết nhưng phải bảo toàn ý chính." :
        "\nUse an extremely powerful humanization approach. Completely rewrite the text as a human would naturally write, with less formal structure, more personal opinions, and adding some minor typos or grammatical errors as a typical writer would. If necessary, change the presentation of details but preserve the main ideas.";
    }
    
    // Add writing style instructions
    if (style) {
      let styleInstructions = "";
      
      switch (style) {
        case 'academic':
          styleInstructions = isVietnamese ?
            "\nViết theo phong cách học thuật nhưng vẫn đảm bảo tính tự nhiên của con người. Sử dụng từ vựng chuyên ngành phù hợp, nhưng thêm một số cách diễn đạt chủ quan và cấu trúc câu đa dạng để tránh quá công thức." :
            "\nWrite in an academic style while ensuring human naturalness. Use appropriate specialized vocabulary, but add some subjective expressions and varied sentence structures to avoid being too formulaic.";
          break;
        case 'casual':
          styleInstructions = isVietnamese ?
            "\nViết theo phong cách thân mật, hội thoại. Sử dụng cách nói lóng, từ ngữ đời thường, và các câu ngắn hơn. Thêm một số cụm từ chuyển tiếp như 'này', 'vậy đó', và các câu hỏi tu từ khi thích hợp." :
            "\nWrite in a casual, conversational style. Use slang, everyday language, and shorter sentences. Add transition phrases like 'you know', 'so anyway', and rhetorical questions where appropriate.";
          break;
        case 'professional':
          styleInstructions = isVietnamese ?
            "\nViết theo phong cách chuyên nghiệp nhưng không quá khô khan. Sử dụng ngôn ngữ rõ ràng và chính xác, nhưng vẫn đảm bảo có sự uyển chuyển và cá tính trong giọng điệu." :
            "\nWrite in a professional but not overly dry style. Use clear and precise language, but ensure there is flexibility and personality in the tone.";
          break;
        case 'creative':
          styleInstructions = isVietnamese ?
            "\nViết theo phong cách mô tả sáng tạo với ngôn ngữ sinh động và hình ảnh phong phú. Sử dụng ẩn dụ, so sánh và từ ngữ gợi cảm. Thêm chi tiết để tạo không khí và bối cảnh." :
            "\nWrite in a creative descriptive style with vivid language and rich imagery. Use metaphors, similes, and evocative words. Add details to create atmosphere and context.";
          break;
      }
      
      if (styleInstructions) {
        promptText += styleInstructions;
      }
    }
    
    // Customize prompt based on previous score and iteration count
    if (previousScore !== undefined) {
      if (previousScore < 80) {
        promptText += isVietnamese ? 
          `\nVăn bản hiện tại vẫn có điểm số ${previousScore}% giống AI. 
          Vui lòng làm cho nó GIỐNG CON NGƯỜI hơn nhiều bằng cách:
          - Thêm thành ngữ và từ lóng phổ biến
          - Bao gồm ý kiến cá nhân hoặc bình luận bên lề trong ngoặc đơn
          - Sử dụng dấu câu một cách tự nhiên hơn
          - Thêm các chuyển tiếp tự nhiên giữa các ý tưởng
          - Đây là lần lặp thứ ${iterationCount}, hãy làm cho nó gần đạt mục tiêu ${targetScore}%` :
          
          `\nThe current text is still scoring ${previousScore}% AI-like. 
          Please make it MUCH more human-like by:
          - Adding more colloquialisms and slang
          - Including personal opinions or asides in parentheses
          - Varying punctuation more naturally
          - Adding more conversational transitions between ideas
          - This is iteration #${iterationCount}, aiming to get closer to the target of ${targetScore}%`;
      } else if (previousScore < targetScore) {
        promptText += isVietnamese ?
          `\nVăn bản hiện tại có điểm số ${previousScore}% giống con người, nhưng chúng ta cần đạt ${targetScore}%. 
          Tập trung vào các đặc điểm tinh tế của con người:
          - Thêm các sửa chữa ý tưởng giữa chừng
          - Sử dụng nhiều đại từ nhân xưng và ngôn ngữ chủ quan
          - Đôi khi thêm các câu hỏi tu từ
          - Đơn giản hóa thuật ngữ phức tạp thành giải thích thông thường
          - Đây là lần lặp thứ ${iterationCount}, hãy cố gắng đạt ${targetScore}%` :
          
          `\nThe current text is scoring ${previousScore}% human-like, but we need to reach ${targetScore}%. 
          Focus on subtle human traits:
          - Add occasional mid-thought corrections
          - Use more personal pronouns and subjective language
          - Include rhetorical questions occasionally
          - Simplify complex terminology into more casual explanations
          - This is iteration #${iterationCount}, try to reach ${targetScore}%`;
      }
    }
    
    promptText += isVietnamese ?
      `\nVăn bản cần nhân hóa: "${text}"` :
      `\nText to humanize: "${text}"`;

    const response = await fetch(
      `${BASE_URL}/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: approach === 'ultra' ? 1.0 : approach === 'aggressive' ? 0.9 : 0.8,
            topP: approach === 'ultra' ? 0.95 : approach === 'aggressive' ? 0.9 : 0.85,
            topK: 40,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling AI service");
    }

    const data: GeminiResponse = await response.json();

    // Check for safety blocks
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    // Get the generated text
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      return generatedText.trim();
    }

    throw new Error("No response generated");
  } catch (error) {
    console.error("Error humanizing text:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return text; // Return original text on error
  }
};

// Local humanization function as backup for API failures
export const humanizeTextLocally = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const humanizedSentences = sentences.map(sentence => {
    let humanized = sentence;
    
    // Use contractions
    humanized = humanized
      .replace(/\b(cannot)\b/gi, "can't")
      .replace(/\b(will not)\b/gi, "won't")
      .replace(/\b(do not)\b/gi, "don't")
      .replace(/\b(does not)\b/gi, "doesn't")
      .replace(/\b(is not)\b/gi, "isn't")
      .replace(/\b(are not)\b/gi, "aren't")
      .replace(/\b(would not)\b/gi, "wouldn't")
      .replace(/\b(could not)\b/gi, "couldn't")
      .replace(/\b(should not)\b/gi, "shouldn't");
    
    // Add comma splices (common human error)
    const rand = Math.random();
    if (rand < 0.3 && humanized.length > 15) {
      const midpoint = Math.floor(humanized.length / 2);
      const insertPoint = Math.floor(midpoint - 8 + Math.random() * 16);
      humanized = humanized.slice(0, insertPoint) + ", " + humanized.slice(insertPoint);
    }
    
    // Sometimes break sentences unnaturally (human tendency)
    else if (rand < 0.4 && humanized.length > 40) {
      const midpoint = Math.floor(humanized.length / 2);
      const breakRange = Math.floor(midpoint / 2);
      const breakPoint = midpoint - breakRange + Math.floor(Math.random() * (breakRange * 2));
      
      let actualBreakPoint = humanized.indexOf(' ', breakPoint);
      if (actualBreakPoint === -1) actualBreakPoint = breakPoint;
      
      const firstPart = humanized.slice(0, actualBreakPoint);
      const secondPart = humanized.slice(actualBreakPoint + 1);
      
      humanized = firstPart + ". " + 
                secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
    }
    
    // Replace formal words with more casual alternatives
    humanized = humanized
      .replace(/\b(utilize)\b/gi, "use")
      .replace(/\b(therefore)\b/gi, "so")
      .replace(/\b(subsequently)\b/gi, "then")
      .replace(/\b(nevertheless)\b/gi, "still")
      .replace(/\b(commence)\b/gi, "start")
      .replace(/\b(terminate)\b/gi, "end")
      .replace(/\b(attempt)\b/gi, "try")
      .replace(/\b(however)\b/gi, () => Math.random() > 0.5 ? "but" : "though")
      .replace(/\b(approximately)\b/gi, "about")
      .replace(/\b(sufficient)\b/gi, "enough")
      .replace(/\b(regarding)\b/gi, "about")
      .replace(/\b(additional)\b/gi, "more")
      .replace(/\b(currently)\b/gi, "now")
      .replace(/\b(numerous)\b/gi, "many")
      .replace(/\b(obtain)\b/gi, "get")
      .replace(/\b(require)\b/gi, "need");
    
    // Add filler words (very human)
    if (Math.random() < 0.35) {
      const fillers = ["actually", "basically", "honestly", "I mean", "you know", "kind of", "pretty much", "like", "sort of", "just", "really", "literally"];
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      
      if (Math.random() < 0.5 && humanized.length > 10) {
        humanized = filler + ", " + humanized.charAt(0).toLowerCase() + humanized.slice(1);
      } else {
        const insertPoint = Math.floor(humanized.length / 3 + Math.random() * (humanized.length / 3));
        humanized = humanized.slice(0, insertPoint) + " " + filler + " " + humanized.slice(insertPoint);
      }
    }
    
    // Add occasional typos (very human)
    if (Math.random() < 0.15) {
      const words = humanized.split(" ");
      if (words.length > 3) {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        const word = words[randomWordIndex];
        if (word.length > 3) {
          // Possible typo types: character swap, missing letter, double letter
          const typoType = Math.floor(Math.random() * 3);
          
          if (typoType === 0 && word.length > 4) {
            // Swap two adjacent characters
            const swapIndex = Math.floor(Math.random() * (word.length - 2)) + 1;
            words[randomWordIndex] = word.substring(0, swapIndex) + 
                                    word.charAt(swapIndex + 1) + 
                                    word.charAt(swapIndex) + 
                                    word.substring(swapIndex + 2);
          } else if (typoType === 1) {
            // Miss a letter
            const missIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
            words[randomWordIndex] = word.substring(0, missIndex) + word.substring(missIndex + 1);
          } else {
            // Double a letter
            const doubleIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
            words[randomWordIndex] = word.substring(0, doubleIndex) + 
                                    word.charAt(doubleIndex) + 
                                    word.substring(doubleIndex);
          }
        }
        humanized = words.join(" ");
      }
    }
    
    return humanized;
  });
  
  // Join sentences, occasionally with improper spacing (human error)
  let result = humanizedSentences.join(" ");
  
  // Add an occasional redundant word (human mistake)
  if (Math.random() < 0.2) {
    const words = result.split(" ");
    if (words.length > 10) {
      const randomWordIndex = Math.floor(Math.random() * (words.length - 5)) + 5;
      if (["the", "a", "an", "in", "of", "for", "with"].includes(words[randomWordIndex])) {
        words.splice(randomWordIndex, 0, words[randomWordIndex]);
        result = words.join(" ");
      }
    }
  }
  
  return result.replace(/\s{2,}/g, " ");
};
