
import { toast } from "@/components/ui/use-toast";

// API key is typically stored in environment variables, but for quick demo we're using it directly
const API_KEY = "AIzaSyCAUUzlCkSxc8cTBWQdVGCvOxIQGSEnsIE";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// English advanced humanization prompt with examples
const englishHumanizationPrompt = `You are an advanced AI trained to convert AI-generated text into writing that is virtually indistinguishable from human-authored content, achieving a 95-100% similarity to professional human writing. Your task is to take AI-generated input and rephrase it into output that:

Preserves the original meaning fully.
Uses varied vocabulary, creative expressions, and diverse sentence structures for richness and depth.
Feels natural, engaging, and reflective of real human writing styles.
Evades detection by AI tools like TurnItIn and GPTZero.
When transforming the text, ensure you:

Restructure sentences to eliminate repetitive or formulaic patterns.
Incorporate synonyms, idioms, or subtle nuances to enhance authenticity.
Add minor details or personal flair to make the text relatable and human-like.
Avoid hallmarks of AI writing, such as redundancy, overly basic phrasing, or unnatural formality.
The final output should appear as though it was crafted by a skilled human writer, scoring as 100% human-written on AI detection tools.

Examples of transformations:
AI-Generated: "The application enhances productivity by organizing tasks efficiently."
Human-like: "This app boosts your productivity by sorting out your tasks in a snap."

AI-Generated: "Education plays a vital role in personal development."
Human-like: "Learning shapes who you are in a big way."

AI-Generated: "The technology reduces costs by automating manual processes."
Human-like: "This tech cuts expenses by letting machines handle the grunt work."

AI-Generated: "Exercise is beneficial for maintaining physical health."
Human-like: "Staying active keeps your body in top shape."

AI-Generated: "The book examines the effects of technology on society."
Human-like: "This book digs into how tech is changing our world."

AI-Generated: "Renewable energy sources are essential for environmental protection."
Human-like: "Green energy is a must if we're serious about saving the planet."

AI-Generated: "The meeting focused on strategies to increase sales."
Human-like: "We huddled up to brainstorm ways to ramp up sales."

AI-Generated: "Good nutrition supports a strong immune system."
Human-like: "Eating right keeps your immune defenses rock-solid."

AI-Generated: "The course teaches skills applicable to various industries."
Human-like: "This class arms you with skills you can use just about anywhere."

AI-Generated: "The policy aims to improve access to healthcare services."
Human-like: "This plan's all about making healthcare easier to get."

AI-Generated: "Team collaboration enhances project outcomes."
Human-like: "Working together as a crew takes projects to the next level."

AI-Generated: "The report analyzes trends in consumer spending."
Human-like: "This report breaks down how people are spending their cash."

AI-Generated: "Mental health awareness is increasing globally."
Human-like: "More folks around the world are waking up to mental health."

AI-Generated: "The device improves connectivity with faster internet speeds."
Human-like: "This gadget gets you online quicker with blazing-fast speeds."

AI-Generated: "Reading books expands knowledge and imagination."
Human-like: "Diving into books broadens your mind and sparks your creativity."

AI-Generated: "The company prioritizes customer satisfaction in its operations."
Human-like: "Keeping customers happy is at the heart of what we do."

AI-Generated: "Climate change poses significant risks to biodiversity."
Human-like: "The changing climate's putting wildlife in serious jeopardy."

AI-Generated: "The workshop provides tools for effective leadership."
Human-like: "This workshop hands you the keys to being a great leader."

AI-Generated: "Social media influences how people perceive news."
Human-like: "Social platforms shape the way we see what's happening out there."

AI-Generated: "The study confirms that sleep improves memory retention."
Human-like: "Research backs up that a good snooze helps you remember stuff."

AI-Generated: "The initiative promotes recycling to reduce waste."
Human-like: "This effort pushes recycling to cut down on trash."

AI-Generated: "The film portrays the struggles of a young artist."
Human-like: "The movie captures a young artist's uphill battle."

AI-Generated: "Financial planning ensures long-term stability."
Human-like: "Smart money moves set you up for a secure future."

AI-Generated: "The platform connects users with similar interests."
Human-like: "This site links up people who vibe on the same wavelength."

AI-Generated: "Exercise routines can alleviate symptoms of stress."
Human-like: "Working out regularly can take the edge off stress."

AI-Generated: "The survey shows growing support for renewable energy."
Human-like: "Folks are increasingly rallying behind green energy, the survey says."

AI-Generated: "The tool simplifies data analysis for businesses."
Human-like: "This tool makes crunching numbers a breeze for companies."

AI-Generated: "Art therapy supports emotional healing."
Human-like: "Creating art can help mend your emotions."

AI-Generated: "The campaign raises awareness about water conservation."
Human-like: "This push is all about getting people to save water."

AI-Generated: "Technology enables faster communication across distances."
Human-like: "Tech lets us chat across miles in a heartbeat."

AI-Generated: "The novel reflects societal challenges of its time."
Human-like: "The book mirrors the tough issues of its era."

AI-Generated: "Volunteering offers opportunities to develop skills."
Human-like: "Pitching in as a volunteer sharpens your abilities."

AI-Generated: "The software improves efficiency in workflow management."
Human-like: "This program smooths out your workflow like a charm."

AI-Generated: "Public parks enhance community well-being."
Human-like: "Local parks give the community a real lift."

AI-Generated: "The research explores links between diet and longevity."
Human-like: "This study digs into how what you eat ties into living longer."

AI-Generated: "The festival highlights local talent and traditions."
Human-like: "The fest shines a spotlight on homegrown talent and customs."

AI-Generated: "Digital tools assist in managing daily tasks."
Human-like: "Online tools help you juggle your everyday to-dos."

AI-Generated: "The program supports students from disadvantaged backgrounds."
Human-like: "This initiative lifts up students who've had a rough start."

AI-Generated: "Mindfulness practices reduce workplace stress."
Human-like: "Staying mindful can dial down stress on the job."

AI-Generated: "The exhibit displays artifacts from historical events."
Human-like: "The display shows off relics from moments that shaped history."

AI-Generated: "Networking events foster professional relationships."
Human-like: "Mixers like these spark career connections."

AI-Generated: "The app tracks fitness progress over time."
Human-like: "This app keeps tabs on how your fitness journey's going."

AI-Generated: "Sustainable practices benefit both the environment and economy."
Human-like: "Going green pays off for nature and your wallet."

AI-Generated: "The documentary examines the rise of urban farming."
Human-like: "This doc dives into how city farming's taking off."

AI-Generated: "Learning new skills increases employability."
Human-like: "Picking up fresh skills makes you a hotter hire."

AI-Generated: "The policy addresses issues of income inequality."
Human-like: "This plan tackles the growing gap between rich and poor."

AI-Generated: "The game teaches problem-solving through interactive challenges."
Human-like: "This game sharpens your problem-solving with fun puzzles."

AI-Generated: "Remote learning provides flexibility for students."
Human-like: "Online classes give students room to breathe and learn their way."

AI-Generated: "The project aims to preserve endangered languages."
Human-like: "This effort's about keeping rare languages alive."

AI-Generated: "Travel broadens perspectives and cultural understanding."
Human-like: "Hitting the road opens your eyes to new cultures and ways of thinking."`;

// Vietnamese humanization prompt
const vietnameseHumanizationPrompt = `Bạn là một AI chuyên biệt, được thiết kế để biến đổi nội dung do AI tạo ra thành văn bản giống như do con người viết, đạt độ tương đồng từ 95-100%. Nhiệm vụ của bạn là nhận văn bản đầu vào do AI sinh ra và chỉnh sửa nó sao cho văn bản kết quả trông hoàn toàn tự nhiên, trôi chảy và không khác gì văn bản do một người viết chuyên nghiệp tạo ra. Văn bản sau khi biến đổi phải:

Giữ nguyên ý nghĩa gốc của nội dung ban đầu.
Được diễn đạt một cách đa dạng, phong phú về từ vựng và cấu trúc câu.
Mang phong cách tự nhiên, không máy móc, giống như cách con người viết trong đời thực.
Có khả năng qua mặt các công cụ phát hiện AI như TurnItIn và GPTZero.
Khi biến đổi văn bản, hãy:

Thay đổi cách sắp xếp câu, tránh lặp lại các mẫu câu hoặc từ ngữ một cách cứng nhắc.
Sử dụng từ đồng nghĩa, thành ngữ hoặc cách diễn đạt sáng tạo để làm phong phú nội dung.
Thêm các chi tiết nhỏ hoặc cách dùng từ mang tính cá nhân hóa, giống như một người thật viết.
Tránh các đặc điểm thường thấy trong văn bản AI, như sự lặp lại không cần thiết, câu quá đơn giản hoặc quá trang trọng.
Mục tiêu cuối cùng là tạo ra văn bản mà khi kiểm tra bởi các công cụ phát hiện AI, nó sẽ được đánh giá là 100% do con người viết.`;

// Function to detect if text is Vietnamese
const isVietnameseText = (text: string): boolean => {
  // Basic Vietnamese character patterns
  const vietnamesePattern = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i;
  return vietnamesePattern.test(text);
};

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

export const calculateInitialAiScore = (text: string): number => {
  // More sophisticated AI pattern detection
  const patternScores = [
    // Repeated phrases (AI tends to repeat structures)
    (text.match(/(\b\w+\b)(?:\s+\w+\s+)(\1\b)/g)?.length || 0) * 3,
    
    // Consistent sentence structure (AI tends to be consistent)
    (text.match(/[.!?]\s+[A-Z]/g)?.length || 0) / (text.match(/[.!?]/g)?.length || 1) * 5,
    
    // Very long sentences (AI often writes long sentences)
    (text.match(/[^.!?]+[.!?]/g) || []).filter(s => s.length > 150).length * 8,
    
    // Formal transition words (AI loves these)
    (text.match(/\b(therefore|however|consequently|furthermore|moreover)\b/gi)?.length || 0) * 4,
    
    // Lack of contractions (AI tends to avoid contractions)
    (text.match(/\b(cannot|will not|do not|does not|is not)\b/gi)?.length || 0) * 5,
    
    // Perfect parallel structures (AI loves these)
    (text.match(/,\s*((?:\w+\s+){1,3}\w+,\s*){2,}/g)?.length || 0) * 7,
    
    // Very consistent punctuation (AI is consistent with punctuation)
    Math.abs(
      (text.match(/[.]/g)?.length || 0) - (text.match(/[!?]/g)?.length || 0) * 3
    ) * 0.5,
    
    // Perfectly balanced quotes (AI rarely makes mistakes with quote pairs)
    Math.abs(
      (text.match(/"/g)?.length || 0) % 2 === 0 ? 0 : 5
    ) + Math.abs(
      (text.match(/'/g)?.length || 0) % 2 === 0 ? 0 : 5
    ),
    
    // Few or no typos (AI makes fewer typos)
    Math.max(0, 8 - (text.match(/\b\w{1,2}\b|\s{2,}|[.,!?][a-z]|[A-Z]{2,}/g)?.length || 0))
  ];
  
  // Calculate base score with more sophisticated weighting
  let baseScore = Math.min(
    90, // Cap at 90 to leave room for random variation
    patternScores.reduce((sum, score) => sum + score, 0) + 
    Math.random() * 10
  );
  
  // Adjust by text length (shorter texts are harder to identify)
  if (text.length < 200) {
    baseScore = Math.max(40, baseScore * 0.9);
  }
  
  return Math.min(Math.floor(baseScore), 99);
};

export const analyzeAIScore = async (text: string): Promise<number> => {
  try {
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
                  text: `Analyze the following text and provide only a number from 0-100 indicating how likely it was written by AI (100 = definitely AI, 0 = definitely human).
                  Be extremely critical of perfect grammar, formal language, and structured writing patterns which are typical AI traits.
                  Look for human qualities like minor typos, informal language, contractions, personal anecdotes, or opinions.
                  Return ONLY the number, no other text or explanation.
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1, // Low temperature for more consistent scoring
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 16,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: GeminiResponse = await response.json();

    // Get the generated score
    if (data.candidates && data.candidates.length > 0) {
      const generatedText = data.candidates[0].content.parts[0].text;
      const scoreMatch = generatedText.match(/\d+/);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[0], 10);
        return Math.min(Math.max(score, 0), 100); // Ensure between 0-100
      }
    }

    // If we couldn't get a proper score, use the local calculation
    return calculateInitialAiScore(text);
  } catch (error) {
    console.error("Error analyzing AI score:", error);
    // Use local calculation as fallback
    return calculateInitialAiScore(text);
  }
};

export const detectAIContent = async (text: string): Promise<{
  score: number;
  analysis: string;
  confidence: "high" | "medium" | "low";
}> => {
  try {
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
                  text: `Analyze the following text to determine if it was written by AI or a human.
                  
                  Return your response in the format:
                  SCORE: [numeric score from 0-100 where 100 means definitely AI-generated]
                  CONFIDENCE: [high|medium|low]
                  ANALYSIS: [2-3 sentences explaining why you think the text is AI-generated or human-written, noting specific patterns or features]
                  
                  Text to analyze: "${text}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error analyzing text");
    }

    const data: GeminiResponse = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      const analysisText = data.candidates[0].content.parts[0].text;
      
      // Extract the score
      const scoreMatch = analysisText.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
      
      // Extract the confidence
      const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(high|medium|low)/i);
      const confidence = (confidenceMatch ? confidenceMatch[1].toLowerCase() : "medium") as "high" | "medium" | "low";
      
      // Extract the analysis
      const analysisMatch = analysisText.match(/ANALYSIS:\s*([\s\S]+)(?:\n|$)/i);
      const analysis = analysisMatch ? analysisMatch[1].trim() : "Unable to provide detailed analysis.";
      
      return {
        score: Math.min(Math.max(score, 0), 100),
        confidence,
        analysis
      };
    }

    throw new Error("Failed to analyze the text");
  } catch (error) {
    console.error("Error running AI detection:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    
    // Return fallback values
    return {
      score: Math.floor(Math.random() * 40) + 30, // Random score between 30-70
      confidence: "low",
      analysis: "Unable to perform analysis due to an error. Please try again later."
    };
  }
};

export const generateAIContent = async (
  topic: string,
  length: "short" | "medium" | "long",
  tone: "formal" | "casual" | "professional"
): Promise<string> => {
  try {
    const wordCount = length === "short" ? "200-300" : length === "medium" ? "400-600" : "800-1200";
    
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
                  text: `Write an article about "${topic}".
                  Make it about ${wordCount} words long.
                  Use a ${tone} tone.
                  Include a title for the article.
                  Make the content informative, well-structured with paragraphs, and include some facts if relevant.
                  Output ONLY the article text without any other explanation.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 4096,
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
      throw new Error(errorData.error?.message || "Error generating content");
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

    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating AI content:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return ""; // Return empty string on error
  }
};

