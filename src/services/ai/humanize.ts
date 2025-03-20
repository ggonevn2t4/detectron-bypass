
import { toast } from "@/components/ui/use-toast";
import { API_KEY, BASE_URL, GeminiResponse, isVietnameseText } from "./common";
import { englishHumanizationPrompt, vietnameseHumanizationPrompt } from "./prompts";
import { calculateInitialAiScore } from "./detect";

// Advanced humanization prompt engineering for better results
export const humanizeTextWithGemini = async (text: string, previousScore?: number): Promise<string> => {
  try {
    // Determine language and select appropriate prompt
    const isVietnamese = isVietnameseText(text);
    const basePrompt = isVietnamese ? vietnameseHumanizationPrompt : englishHumanizationPrompt;
    
    // Craft a more detailed prompt based on previous score if available
    let promptText = basePrompt;
    
    // If we have a previous score, customize the prompt further
    if (previousScore !== undefined) {
      if (previousScore < 80) {
        promptText += isVietnamese ? 
          `\nVăn bản hiện tại vẫn có điểm số ${previousScore}% giống AI. 
          Vui lòng làm cho nó GIỐNG CON NGƯỜI hơn nhiều bằng cách:
          - Thêm thành ngữ và từ lóng phổ biến
          - Bao gồm ý kiến cá nhân hoặc bình luận bên lề trong ngoặc đơn
          - Sử dụng dấu câu một cách tự nhiên hơn
          - Thêm các chuyển tiếp tự nhiên giữa các ý tưởng` :
          `\nThe current text is still scoring ${previousScore}% AI-like. 
          Please make it MUCH more human-like by:
          - Adding more colloquialisms and slang
          - Including personal opinions or asides in parentheses
          - Varying punctuation more naturally
          - Adding more conversational transitions between ideas`;
      } else if (previousScore < 90) {
        promptText += isVietnamese ?
          `\nVăn bản hiện tại có điểm số ${previousScore}% giống con người, nhưng chúng ta cần ít nhất 95%. 
          Tập trung vào các đặc điểm tinh tế của con người:
          - Thêm các sửa chữa ý tưởng giữa chừng
          - Sử dụng nhiều đại từ nhân xưng và ngôn ngữ chủ quan
          - Đôi khi thêm các câu hỏi tu từ
          - Đơn giản hóa thuật ngữ phức tạp thành giải thích thông thường` :
          `\nThe current text is scoring ${previousScore}% human-like, but we need at least 95%. 
          Focus on subtle human traits:
          - Add occasional mid-thought corrections
          - Use more personal pronouns and subjective language
          - Include rhetorical questions occasionally
          - Simplify complex terminology into more casual explanations`;
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
            temperature: 0.9, // Increased for more randomness and human-like output
            topP: 0.9,
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
